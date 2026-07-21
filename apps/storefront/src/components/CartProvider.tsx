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
import type { StoreProduct } from "@/data/catalog";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";

const STORAGE_KEY = "casa-atenta-store-cart-v2";
const EMPTY_LINES: CartLine[] = [];
const CATEGORY_SLUGS = new Set<StoreProduct["category"]>([
  "inalambricas",
  "perforacion-demolicion",
  "corte-desbaste",
  "taller-industria",
  "limpieza",
  "baterias-accesorios",
]);
const PRODUCT_TONES = new Set<StoreProduct["tone"]>([
  "blue",
  "cyan",
  "amber",
  "steel",
  "navy",
  "mint",
]);
let browserSnapshot: CartLine[] | null = null;
const cartListeners = new Set<() => void>();

export type CartProduct = Pick<
  StoreProduct,
  | "id"
  | "slug"
  | "model"
  | "brand"
  | "name"
  | "shortName"
  | "category"
  | "priceMinor"
  | "stock"
  | "stockLabel"
  | "tone"
  | "media"
>;

export type CartLine = {
  product: CartProduct;
  quantity: number;
};

export type ResolvedCartLine = CartLine & {
  productId: string;
  lineTotalMinor: number;
};

type CartContextValue = {
  lines: ResolvedCartLine[];
  itemCount: number;
  subtotalMinor: number;
  drawerOpen: boolean;
  hydrated: boolean;
  addItem: (product: CartProduct, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

function isShortString(value: unknown, maxLength = 240): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= maxLength;
}

function sanitizeProduct(value: unknown): CartProduct | null {
  if (typeof value !== "object" || value === null) return null;

  const candidate = value as Partial<CartProduct>;
  if (
    !isShortString(candidate.id, 120) ||
    !isShortString(candidate.slug, 180) ||
    !isShortString(candidate.model, 120) ||
    candidate.brand !== "Dongcheng" ||
    !isShortString(candidate.name) ||
    !isShortString(candidate.shortName) ||
    !CATEGORY_SLUGS.has(candidate.category as StoreProduct["category"]) ||
    !Number.isSafeInteger(candidate.priceMinor) ||
    (candidate.priceMinor as number) <= 0 ||
    (candidate.priceMinor as number) > 1_000_000_000 ||
    !Number.isSafeInteger(candidate.stock) ||
    (candidate.stock as number) <= 0 ||
    (candidate.stock as number) > 1_000_000 ||
    !isShortString(candidate.stockLabel) ||
    !PRODUCT_TONES.has(candidate.tone as StoreProduct["tone"])
  ) {
    return null;
  }

  const media = Array.isArray(candidate.media)
    ? candidate.media.slice(0, 3).flatMap((image) => {
        if (
          typeof image !== "object" ||
          image === null ||
          !isShortString(image.src, 1_000) ||
          !isShortString(image.alt, 300) ||
          !isShortString(image.label, 120) ||
          (!image.src.startsWith("/") && !image.src.startsWith("https://"))
        ) {
          return [];
        }
        return [{ src: image.src, alt: image.alt, label: image.label }];
      })
    : [];

  return {
    id: candidate.id,
    slug: candidate.slug,
    model: candidate.model,
    brand: candidate.brand,
    name: candidate.name,
    shortName: candidate.shortName,
    category: candidate.category as StoreProduct["category"],
    priceMinor: candidate.priceMinor as number,
    stock: candidate.stock as number,
    stockLabel: candidate.stockLabel,
    tone: candidate.tone as StoreProduct["tone"],
    media,
  };
}

function sanitizeLines(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];

  const byProduct = new Map<string, CartLine>();
  for (const line of value.slice(0, 50)) {
    if (
      typeof line !== "object" ||
      line === null ||
      !("product" in line) ||
      !("quantity" in line) ||
      typeof line.quantity !== "number"
    ) {
      continue;
    }

    const product = sanitizeProduct(line.product);
    if (!product) continue;

    const previous = byProduct.get(product.id)?.quantity ?? 0;
    const limit = Math.min(20, product.stock);
    byProduct.set(product.id, {
      product,
      quantity: Math.max(
        1,
        Math.min(limit, previous + Math.max(1, Math.floor(line.quantity))),
      ),
    });
  }

  return [...byProduct.values()];
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
  const next = sanitizeLines(updater(readBrowserSnapshot()));
  browserSnapshot = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // The in-memory cart remains usable when storage is unavailable or full.
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

  const addItem = useCallback((product: CartProduct, quantity = 1) => {
    const snapshot = sanitizeProduct(product);
    if (!snapshot) return;

    updateCart((current) => {
      const existing = current.find((line) => line.product.id === snapshot.id);
      const limit = Math.min(20, snapshot.stock);
      if (existing) {
        return current.map((line) =>
          line.product.id === snapshot.id
            ? {
                product: snapshot,
                quantity: Math.min(
                  limit,
                  line.quantity + Math.max(1, Math.floor(quantity)),
                ),
              }
            : line,
        );
      }
      return [
        ...current,
        {
          product: snapshot,
          quantity: Math.max(1, Math.min(limit, Math.floor(quantity))),
        },
      ];
    });
    setDrawerOpen(true);
  }, []);

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    if (quantity <= 0) {
      updateCart((current) =>
        current.filter((line) => line.product.id !== productId),
      );
      return;
    }
    updateCart((current) =>
      current.map((line) =>
        line.product.id === productId
          ? {
              ...line,
              quantity: Math.min(
                20,
                line.product.stock,
                Math.max(1, Math.floor(quantity)),
              ),
            }
          : line,
      ),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    updateCart((current) =>
      current.filter((line) => line.product.id !== productId),
    );
  }, []);

  const lines = useMemo<ResolvedCartLine[]>(
    () =>
      rawLines.map((line) => ({
        ...line,
        productId: line.product.id,
        lineTotalMinor: (line.product.priceMinor as number) * line.quantity,
      })),
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
