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

const STORAGE_KEY = "casa-atenta-store-cart-v1";
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

function sanitizeLines(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((line) => {
    if (
      typeof line !== "object" ||
      line === null ||
      !("productId" in line) ||
      !("quantity" in line) ||
      typeof line.productId !== "string" ||
      typeof line.quantity !== "number"
    ) {
      return [];
    }

    const product = products.find((candidate) => candidate.id === line.productId);
    if (!product || product.priceMinor === null) return [];

    return [
      {
        productId: line.productId,
        quantity: Math.max(1, Math.min(20, Math.floor(line.quantity))),
      },
    ];
  });
}

function readBrowserSnapshot() {
  if (browserSnapshot) return browserSnapshot;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    browserSnapshot = saved ? sanitizeLines(JSON.parse(saved)) : [];
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
  const next = updater(readBrowserSnapshot());
  browserSnapshot = next;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
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
    const product = products.find((candidate) => candidate.id === productId);
    if (!product || product.priceMinor === null) return;

    updateCart((current) => {
      const existing = current.find((line) => line.productId === productId);
      if (existing) {
        return current.map((line) =>
          line.productId === productId
            ? { ...line, quantity: Math.min(20, line.quantity + quantity) }
            : line,
        );
      }
      return [...current, { productId, quantity: Math.max(1, quantity) }];
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
    updateCart((current) =>
      current.map((line) =>
        line.productId === productId
          ? { ...line, quantity: Math.min(20, Math.floor(quantity)) }
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
        const product = products.find((candidate) => candidate.id === line.productId);
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
