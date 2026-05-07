"use client";

import { DateTime } from "luxon";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { PosSaleEntity } from "@/features/pos/domain/entities/pos-sale";
import { PosSaleSettlementChip } from "@/features/pos/presentations/components/pos-sale-settlement-chip";
import { PosSaleStatusChip } from "@/features/pos/presentations/components/pos-sale-status-chip";
import { formatPayInMethodLabel } from "@/features/pos/presentations/components/pos-sale-status-helpers";

type ReceiptCardProps = {
  sale: PosSaleEntity;
};

export function ReceiptCard({ sale }: ReceiptCardProps) {
  const invoiceDate = DateTime.fromISO(sale.invoiceDate);
  const formattedDate = invoiceDate.isValid
    ? invoiceDate.setLocale("id-ID").toFormat("dd LLL yyyy, HH:mm")
    : sale.invoiceDate;

  return (
    <div className="flex w-full flex-col gap-y-4 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-y-1 text-center">
        <span className="text-base font-semibold text-neutral-500">{sale.receiptNumber}</span>
        <span className="text-xs text-neutral-300">{formattedDate}</span>
      </div>

      <div className="border-t border-t-neutral-100" />

      <div className="flex flex-col gap-y-2">
        {sale.items.map((item) => (
          <div key={item.id} className="flex flex-col gap-y-0.5">
            <div className="flex flex-row items-center justify-between gap-x-3">
              <div className="flex min-w-0 flex-1 flex-row items-center gap-x-2.5">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-neutral-100 text-xs font-semibold tabular-nums text-neutral-400">
                  {item.qty}
                </span>
                <span className="truncate text-sm text-neutral-500">{item.name}</span>
              </div>
              <span className="shrink-0 text-sm text-neutral-300">
                <NumberDisplay value={item.price} />
              </span>
              <span className="w-24 shrink-0 text-right text-sm font-medium text-neutral-500">
                <NumberDisplay value={item.total} />
              </span>
            </div>
            {item.discount !== null && item.discount > 0 && (
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
        ))}
      </div>

      <div className="border-t border-t-neutral-100" />

      <div className="flex flex-col gap-y-1 text-sm">
        <div className="flex flex-row justify-between text-neutral-400">
          <span>Subtotal</span>
          <span>
            <NumberDisplay value={sale.subtotal} />
          </span>
        </div>
        <div className="flex flex-row justify-between font-semibold text-neutral-500">
          <span>Total</span>
          <span>
            <NumberDisplay value={sale.total} suffix="IDR" />
          </span>
        </div>
      </div>

      <div className="border-t border-t-neutral-100" />

      <div className="flex flex-col gap-y-2 text-sm">
        <div className="flex flex-row items-center justify-between">
          <span className="text-neutral-400">Metode</span>
          <span className="text-neutral-500">{formatPayInMethodLabel(sale.payInDetail?.method)}</span>
        </div>
        <div className="flex flex-row items-center justify-between">
          <span className="text-neutral-400">Pembayaran</span>
          <PosSaleStatusChip sale={sale} />
        </div>
        <div className="flex flex-row items-center justify-between">
          <span className="text-neutral-400">Settlement</span>
          <PosSaleSettlementChip sale={sale} />
        </div>
      </div>

      {sale.note && (
        <>
          <div className="border-t border-t-neutral-100" />
          <div className="flex flex-col gap-y-1 text-sm">
            <span className="text-neutral-300">Catatan</span>
            <span className="text-neutral-500">{sale.note}</span>
          </div>
        </>
      )}
    </div>
  );
}
