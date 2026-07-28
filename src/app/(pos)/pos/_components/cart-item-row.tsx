"use client";

import { memo } from "react";
import { MinusIcon, PlusIcon } from "@heroicons/react/16/solid";
import { ActionMenu } from "@/core/presentations/components/action-menu";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { CartLine } from "@/app/(pos)/pos/_providers/pos-provider.types";
import { usePosCart } from "@/app/(pos)/pos/_providers/pos-provider";

type CartItemRowProps = {
  item: CartLine;
};

function CartItemRowInner({ item }: CartItemRowProps) {
  const { updateQty, removeItem, stockErrors, priceMismatch } = usePosCart();
  const beStockError = stockErrors.get(item.variantId) ?? null;
  const pricingError = priceMismatch?.variantId === item.variantId ? priceMismatch : null;

  // Cart-side real-time warning: qty exceeds the snapshot taken at add-time.
  const localOverLimit =
    item.availableQtySnapshot !== null && item.qty > item.availableQtySnapshot ? item.availableQtySnapshot : null;

  const displayName = item.variantName ? `${item.productName} · ${item.variantName}` : item.productName;

  return (
    <div className="flex flex-col gap-y-1 border-b border-b-neutral-100 px-4 py-3 last:border-b-0">
      <div className="flex flex-row items-baseline gap-x-3">
        <span className="line-clamp-2 flex-1 text-sm leading-5 text-neutral-500">{displayName}</span>
        <span className="shrink-0 text-sm leading-5 font-semibold tabular-nums text-neutral-500">
          Rp <NumberDisplay value={item.preview.estimatedLineAmount} />
        </span>
      </div>
      <div className="flex flex-row items-center gap-x-3">
        <span className="text-xs leading-4 tabular-nums text-neutral-300">
          <NumberDisplay value={item.preview.estimatedUnitPrice} /> ×
        </span>
        {item.preview.isTiered && <StatusChip label="Grosir" variant="primary" compact />}
        <div className="flex flex-row items-center gap-x-1">
          <button
            type="button"
            onClick={() => updateQty(item.productId, item.variantId, item.qty - 1)}
            className="flex size-11 items-center justify-center rounded-md border border-neutral-200 text-neutral-400 transition-colors hover:bg-neutral-50"
            aria-label="Kurangi"
          >
            <MinusIcon className="size-4" />
          </button>
          <span className="min-w-11 text-center text-sm font-medium tabular-nums text-neutral-500">{item.qty}</span>
          <button
            type="button"
            onClick={() => updateQty(item.productId, item.variantId, item.qty + 1)}
            className="flex size-11 items-center justify-center rounded-md border border-neutral-200 text-neutral-400 transition-colors hover:bg-neutral-50"
            aria-label="Tambah"
          >
            <PlusIcon className="size-4" />
          </button>
        </div>
        <div className="ml-auto">
          <ActionMenu
            options={[
              {
                label: "Hapus",
                variant: "danger",
                onClick: () => removeItem(item.productId, item.variantId),
              },
            ]}
          />
        </div>
      </div>
      {beStockError && (
        <span className="text-xs leading-4 font-medium text-error-300">
          ⚠ Stok hanya {beStockError.available}, diminta {beStockError.requested}
        </span>
      )}
      {!beStockError && localOverLimit !== null && (
        <span className="text-xs leading-4 font-medium text-warning-300">
          ⚠ Stok tersisa {localOverLimit}
        </span>
      )}
      {pricingError && (
        <span className="text-xs leading-4 font-medium text-error-300">
          ⚠ Harga berubah: <NumberDisplay value={pricingError.submittedUnitPrice} /> →{" "}
          <NumberDisplay value={pricingError.resolvedUnitPrice} />
        </span>
      )}
    </div>
  );
}

export const CartItemRow = memo(CartItemRowInner);
