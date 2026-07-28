"use client";

import { NumberDisplay } from "@/core/presentations/components/number-display";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { InvoiceItemEntity } from "@/features/invoice/domain/entities/invoice-item";
import { isTierPricedItem } from "@/features/invoice/domain/guards/invoice-guards";
import { POS_RECEIPT_COPY } from "@/features/invoice/presentations/components/pos-receipt-card-copy";

type PosReceiptLineProps = {
  item: InvoiceItemEntity;
};

export function PosReceiptLine({ item }: PosReceiptLineProps) {
  const isTiered = isTierPricedItem(item);

  return (
    <div className="flex flex-col gap-y-0.5">
      <div className="flex flex-row items-start justify-between gap-x-3">
        <div className="flex min-w-0 flex-1 flex-row items-start gap-x-2.5">
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-xs font-semibold tabular-nums text-neutral-500">
            <NumberDisplay value={item.qty} />
          </span>
          <div className="flex min-w-0 flex-col">
            <div className="flex flex-row items-center gap-x-1.5">
              <span className="truncate text-sm text-neutral-500">{item.name}</span>
              {isTiered && <StatusChip label={POS_RECEIPT_COPY.TIER_BADGE_LABEL} variant="primary" compact />}
            </div>

            {/*
              A GRADUATED tier line's `price` is a blended presentational figure that does
              not reconcile with the amount charged, so showing "qty x price" next to a
              total the cashier cannot reproduce is worse than omitting it. Base-priced
              lines keep the familiar breakdown.
            */}
            {!isTiered && item.qty > 1 && (
              <span className="text-xs tabular-nums text-neutral-300">
                <NumberDisplay value={item.qty} /> × <NumberDisplay value={item.price} />
              </span>
            )}

            {/* Each fragment is independently conditional: a null field omits its own line. */}
            {isTiered && item.appliedTierMinQty !== null && (
              <span className="text-xs tabular-nums text-neutral-300">
                {POS_RECEIPT_COPY.TIER_BRACKET_LABEL} <NumberDisplay value={item.appliedTierMinQty} />
              </span>
            )}
            {isTiered && item.listPrice !== null && (
              <span className="text-xs tabular-nums text-neutral-300">
                {POS_RECEIPT_COPY.TIER_LIST_PRICE_LABEL} <NumberDisplay value={item.listPrice} />
              </span>
            )}
          </div>
        </div>
        {/*
          Always the server's line amount, never qty x price — under GRADUATED the two
          genuinely differ. Falls back to `total` for lines that predate the field.
        */}
        <span className="w-24 shrink-0 text-right text-sm font-medium tabular-nums text-neutral-500">
          <NumberDisplay value={item.amountBeforeTax ?? item.total} />
        </span>
      </div>

      {item.discount !== undefined && item.discount > 0 && (
        <div className="flex flex-row justify-between text-xs text-neutral-300">
          <span>Diskon</span>
          <span>
            -<NumberDisplay value={item.discount} />
          </span>
        </div>
      )}
      {item.tax > 0 && (
        <div className="flex flex-row justify-between text-xs text-neutral-300">
          <span>Pajak</span>
          <span>
            <NumberDisplay value={item.tax} />
          </span>
        </div>
      )}
    </div>
  );
}
