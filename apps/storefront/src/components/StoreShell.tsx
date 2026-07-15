import type { ReactNode } from "react";
import { CartDrawer } from "./CartDrawer";
import { CartProvider } from "./CartProvider";
import { StoreFooter } from "./StoreFooter";
import { StoreHeader } from "./StoreHeader";

export function StoreShell({ children }: { children: ReactNode }) {
  return (
    <CartProvider>
      <StoreHeader />
      <main className="store-main">{children}</main>
      <StoreFooter />
      <CartDrawer />
    </CartProvider>
  );
}
