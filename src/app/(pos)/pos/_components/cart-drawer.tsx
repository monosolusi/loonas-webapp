"use client";

import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import { CartEmptyState } from "@/app/(pos)/pos/_components/cart-empty-state";
import { CartItemRow } from "@/app/(pos)/pos/_components/cart-item-row";
import { CartSoftcapChip } from "@/app/(pos)/pos/_components/cart-softcap-chip";
import { CartSummary } from "@/app/(pos)/pos/_components/cart-summary";
import { usePosCart, usePosUI } from "@/app/(pos)/pos/_providers/pos-provider";
import { CART_SOFTCAP_THRESHOLD } from "@/app/(pos)/pos/_components/cart-softcap";

export function CartDrawer() {
  const { items } = usePosCart();
  const { drawerOpen } = usePosUI();

  const itemCount = items.length;
  const showSoftcap = itemCount >= CART_SOFTCAP_THRESHOLD;

  return (
    <Transition
      as={Fragment}
      show={drawerOpen}
      enter="transition ease-out duration-250"
      enterFrom="translate-y-full opacity-0"
      enterTo="translate-y-0 opacity-100"
      leave="transition ease-in duration-200"
      leaveFrom="translate-y-0 opacity-100"
      leaveTo="translate-y-full opacity-0"
    >
      {/* bottom-16 = height of PeekStrip (h-16). z-20 keeps it below PeekStrip (z-30). */}
      <div className="fixed inset-x-0 bottom-16 z-20 flex h-[60vh] flex-col border-t border-neutral-200 bg-white lg:hidden">
        {/* Drawer header */}
        <div className="flex h-11 shrink-0 items-center gap-x-2 border-b border-b-neutral-100 px-4">
          <span className="text-sm font-medium text-neutral-500">Keranjang</span>
          {showSoftcap && <CartSoftcapChip />}
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
          {itemCount === 0 ? (
            <CartEmptyState />
          ) : (
            <div className="flex flex-col">
              {items.map((item) => (
                <CartItemRow key={`${item.productId}:${item.variantId}`} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Summary without CTA — Bayar lives in PeekStrip */}
        <div className="border-t border-t-neutral-100 px-4 py-4">
          <CartSummary showCta={false} />
        </div>
      </div>
    </Transition>
  );
}
