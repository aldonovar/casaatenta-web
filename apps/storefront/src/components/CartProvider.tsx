"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { products, type StoreProduct } from "@/data/catalog";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";

const STORAGE_KEY = "casa-atenta-store-cart-v3";
const LEGACY_STORAGE_KEYS = [
  "casa-atenta-store-cart-v2",
  "casa-atenta-store-cart-v1",
] as const;
const EMPTY_LINES: CartLine[] = [];
let browserSnapshot: CartLine[] | null = null;
const cartListeners = new Set<() => void>();

export type CartLine = {
  productId: string;
  quantity: number;
};

export type ResolvedCartLine = CartLine & {
  product: StoreProduct;
  lineTotalMinor: number;
};

type CartContextValue = {
  lines: ResolvedCartLine[];
  itemCount: number;
  subtotalMinor: number;
  drawerOpen: boolean;
  hydrated: boolean;
  addItem: (productId: string, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function purchasableProduct(productId: string) {
  return products.find(
    (candidate) =>
      candidate.id === productId &&
      candidate.priceMinor !== null &&
      candidate.stock > 0 &&
      candidate.shippingClass === "standard",
  );
}

function sanitizeLines(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];

  const byProduct = new Map<string, CartLine>();
  for (const line of value.slice(0, 50)) {
    if (
      typeof line !== "object" ||
      line === null ||
      !("productId" in line) ||
      !("quantity" in line) ||
      typeof line.productId !== "string" ||
      typeof line.quantity !== "number" ||
      !Number.isFinite(line.quantity)
    ) {
      continue;
    }

    const product = purchasableProduct(line.productId);
    if (!product) continue;

    const previous = byProduct.get(product.id)?.quantity ?? 0;
    const requested = Math.max(1, Math.floor(line.quantity));
    byProduct.set(product.id, {
      productId: product.id,
      quantity: Math.min(20, product.stock, previous + requested),
    });
  }

  return [...byProduct.values()];
}

function parseStoredLines(serialized: string) {
  const parsed = JSON.parse(serialized) as unknown;
  if (!Array.isArray(parsed)) return [];

  return sanitizeLines(
    parsed.map((line) => {
      if (typeof line !== "object" || line === null) return line;
      if ("productId" in line) return line;
      if (
        "product" in line &&
        typeof line.product === "object" &&
        line.product !== null &&
        "id" in line.product
      ) {
        return {
          productId: line.product.id,
          quantity: "quantity" in line ? line.quantity : 1,
        };
      }
      return line;
    }),
  );
}

function readBrowserSnapshot() {
  if (browserSnapshot) return browserSnapshot;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      browserSnapshot = parseStoredLines(saved);
      return browserSnapshot;
    }

    for (const legacyKey of LEGACY_STORAGE_KEYS) {
      const legacy = window.localStorage.getItem(legacyKey);
      if (!legacy) continue;
      browserSnapshot = parseStoredLines(legacy);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(browserSnapshot));
      return browserSnapshot;
    }

    browserSnapshot = [];
  } catch {
    browserSnapshot = [];
  }
  return browserSnapshot;
}

function subscribeToCart(listener: () => void) {
  cartListeners.add(listener);
  const storageListener = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    try {
      browserSnapshot = event.newValue
        ? sanitizeLines(JSON.parse(event.newValue))
        : [];
    } catch {
      browserSnapshot = [];
    }
    cartListeners.forEach((notify) => notify());
  };
  window.addEventListener("storage", storageListener);
  return () => {
    cartListeners.delete(listener);
    window.removeEventListener("storage", storageListener);
  };
}

function updateCart(updater: (current: CartLine[]) => CartLine[]) {
  const next = sanitizeLines(updater(readBrowserSnapshot()));
  browserSnapshot = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // El carrito en memoria sigue operativo si el almacenamiento no está disponible.
  }
  cartListeners.forEach((listener) => listener());
}

function subscribeHydration() {
  return () => undefined;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const rawLines = useSyncExternalStore(
    subscribeToCart,
    readBrowserSnapshot,
    () => EMPTY_LINES,
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const hydrated = useSyncExternalStore(
    subscribeHydration,
    () => true,
    () => false,
  );

  useBodyScrollLock(drawerOpen);

  const addItem = useCallback((productId: string, quantity = 1) => {
    const product = purchasableProduct(productId);
    if (!product) return;

    const requested = Number.isFinite(quantity)
      ? Math.max(1, Math.floor(quantity))
      : 1;
    const limit = Math.min(20, product.stock);

    updateCart((current) => {
      const existing = current.find((line) => line.productId === productId);
      if (existing) {
        return current.map((line) =>
          line.productId === productId
            ? { ...line, quantity: Math.min(limit, line.quantity + requested) }
            : line,
        );
      }
      return [...current, { productId, quantity: Math.min(limit, requested) }];
    });
    setDrawerOpen(true);
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      updateCart((current) =>
        current.filter((line) => line.productId !== productId),
      );
      return;
    }

    const product = purchasableProduct(productId);
    if (!product) {
      updateCart((current) =>
        current.filter((line) => line.productId !== productId),
      );
      return;
    }

    updateCart((current) =>
      current.map((line) =>
        line.productId === productId
          ? {
              ...line,
              quantity: Math.min(
                20,
                product.stock,
                Math.max(1, Math.floor(quantity)),
              ),
            }
          : line,
      ),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    updateCart((current) =>
      current.filter((line) => line.productId !== productId),
    );
  }, []);

  const lines = useMemo<ResolvedCartLine[]>(
    () =>
      rawLines.flatMap((line) => {
        const product = purchasableProduct(line.productId);
        if (!product || product.priceMinor === null) return [];
        return [
          {
            ...line,
            product,
            lineTotalMinor: product.priceMinor * line.quantity,
          },
        ];
      }),
    [rawLines],
  );

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      itemCount: lines.reduce((sum, line) => sum + line.quantity, 0),
      subtotalMinor: lines.reduce((sum, line) => sum + line.lineTotalMinor, 0),
      drawerOpen,
      hydrated,
      addItem,
      updateQuantity,
      removeItem,
      clearCart: () => updateCart(() => []),
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
    }),
    [addItem, drawerOpen, hydrated, lines, removeItem, updateQuantity],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
}
