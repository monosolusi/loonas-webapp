"use client";

import { ChevronUpIcon, ShoppingCartIcon } from "@heroicons/react/24/outline";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { usePosCart, usePosUI } from "@/app/(pos)/pos/_providers/pos-provider";
import { CartSummaryBayarButton } from "@/app/(pos)/pos/_components/cart-summary-bayar-button";

/**
 * Sticky bottom cart bar (mobile). A slim, tappable summary row opens the
 * full-screen order review (CartDrawer) to edit quantities; below it, a
 * full-width Bayar button starts checkout directly. Hidden on desktop and
 * during the checkout wizard.
 */
export function PeekStrip() {
  const { items, total } = usePosCart();
  const { checkoutStep, toggleDrawer } = usePosUI();

  if (checkoutStep !== null) return null;

  const itemCount = items.reduce((sum, item) => sum + item.qty, 0);

  if (itemCount === 0) {
    return (
      <div className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-center border-t border-neutral-200 bg-white px-4 pb-[env(safe-area-inset-bottom)] text-sm text-neutral-300 lg:hidden">
        Keranjang kosong — pilih produk untuk mulai
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex flex-col gap-y-2 border-t border-neutral-200 bg-white px-4 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] lg:hidden">
      <button
        type="button"
        onClick={toggleDrawer}
        aria-label="Lihat pesanan"
        className="flex w-full flex-row items-center gap-x-2 py-1 text-left"
      >
        <ShoppingCartIcon className="size-5 shrink-0 text-neutral-400" />
        <span className="text-sm font-medium text-neutral-500">{itemCount} item</span>
        <span className="ml-auto text-sm font-semibold tabular-nums text-neutral-500">
          Rp <NumberDisplay value={total} />
        </span>
        <ChevronUpIcon className="size-4 shrink-0 text-neutral-300" />
      </button>

      <CartSummaryBayarButton />
    </div>
  );
}
