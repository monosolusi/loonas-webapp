"use client";

import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { CartEmptyState } from "@/app/(pos)/pos/_components/cart-empty-state";
import { CartItemRow } from "@/app/(pos)/pos/_components/cart-item-row";
import { CartSummary } from "@/app/(pos)/pos/_components/cart-summary";
import { CartSoftcapChip } from "@/app/(pos)/pos/_components/cart-softcap-chip";
import { usePosCart, usePosUI } from "@/app/(pos)/pos/_providers/pos-provider";
import { CART_SOFTCAP_THRESHOLD } from "@/app/(pos)/pos/_components/cart-softcap";

/**
 * Full-screen order review (mobile). Slides up over the catalog; holds the line
 * items with qty steppers, the total, and the Bayar CTA (via CartSummary). The
 * provider closes this automatically when checkout starts.
 */
export function CartDrawer() {
  const { items } = usePosCart();
  const { drawerOpen, toggleDrawer } = usePosUI();

  const itemCount = items.length;
  const showSoftcap = itemCount >= CART_SOFTCAP_THRESHOLD;

  return (
    <Transition
      as={Fragment}
      show={drawerOpen}
      enter="transition ease-out duration-250"
      enterFrom="translate-y-full"
      enterTo="translate-y-0"
      leave="transition ease-in duration-200"
      leaveFrom="translate-y-0"
      leaveTo="translate-y-full"
    >
      <div className="fixed inset-0 z-40 flex flex-col bg-white lg:hidden">
        {/* Header */}
        <div className="flex h-14 shrink-0 items-center gap-x-2 border-b border-b-neutral-100 px-4">
          <button
            type="button"
            onClick={toggleDrawer}
            aria-label="Tutup pesanan"
            className="-ml-2 flex size-9 items-center justify-center rounded-md text-neutral-400 transition-colors hover:bg-neutral-50"
          >
            <XMarkIcon className="size-5" />
          </button>
          <span className="text-base font-semibold text-neutral-500">Pesanan</span>
          {itemCount > 0 && <span className="text-sm tabular-nums text-neutral-300">· {itemCount} item</span>}
          {showSoftcap && (
            <span className="ml-auto">
              <CartSoftcapChip />
            </span>
          )}
        </div>

        {/* Line items */}
        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {itemCount === 0 ? (
            <CartEmptyState />
          ) : (
            items.map((item) => <CartItemRow key={`${item.productId}:${item.variantId}`} item={item} />)
          )}
        </div>

        {/* Summary + Bayar CTA */}
        {itemCount > 0 && (
          <div className="shrink-0 border-t border-t-neutral-100 px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <CartSummary />
          </div>
        )}
      </div>
    </Transition>
  );
}
