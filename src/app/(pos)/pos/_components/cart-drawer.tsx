"use client";

import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import { CartEmptyState } from "@/app/(pos)/pos/_components/cart-empty-state";
import { CartItemRow } from "@/app/(pos)/pos/_components/cart-item-row";
import { CartSummary } from "@/app/(pos)/pos/_components/cart-summary";
import { usePosCart } from "@/app/(pos)/pos/_providers/pos-provider";

type CartDrawerProps = {
  open: boolean;
};

export function CartDrawer({ open }: CartDrawerProps) {
  const { items } = usePosCart();

  const itemCount = items.length;

  return (
    <Transition
      as={Fragment}
      show={open}
      enter="transition ease-out duration-250"
      enterFrom="translate-y-full opacity-0"
      enterTo="translate-y-0 opacity-100"
      leave="transition ease-in duration-200"
      leaveFrom="translate-y-0 opacity-100"
      leaveTo="translate-y-full opacity-0"
    >
      {/* bottom-16 = height of PeekStrip (h-16). z-20 keeps it below PeekStrip (z-30). */}
      <div className="fixed inset-x-0 bottom-16 z-20 flex h-[60vh] flex-col border-t border-neutral-200 bg-white lg:hidden">
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
