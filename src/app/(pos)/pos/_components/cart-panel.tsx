"use client";

import { CartEmptyState } from "@/app/(pos)/pos/_components/cart-empty-state";
import { CartItemRow } from "@/app/(pos)/pos/_components/cart-item-row";
import { CartSummary } from "@/app/(pos)/pos/_components/cart-summary";
import { usePosCart } from "@/app/(pos)/pos/_providers/pos-provider";

export function CartPanel() {
  const { items } = usePosCart();

  const itemCount = items.length;

  return (
    <div className="hidden h-full flex-col rounded-lg border border-neutral-200 bg-white lg:flex">
      <div className="flex flex-row items-baseline gap-x-2 border-b border-b-neutral-100 px-4 py-3">
        <span className="text-base font-semibold text-neutral-500">Keranjang</span>
        {itemCount > 0 && (
          <>
            <span className="text-neutral-200">·</span>
            <span className="text-sm tabular-nums text-neutral-400">{itemCount} item</span>
          </>
        )}
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

      <div className="border-t border-t-neutral-100 px-4 py-4">
        <CartSummary />
      </div>
    </div>
  );
}
