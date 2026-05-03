"use client";

import { DateTime } from "luxon";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { useReceipt } from "@/app/(pos)/pos/receipt/[id]/_providers/receipt-provider";

export function ReceiptCard() {
  const { sale } = useReceipt();

  const invoiceDate = DateTime.fromISO(sale.invoiceDate);
  const formattedDate = invoiceDate.isValid
    ? invoiceDate.setLocale("id-ID").toFormat("dd LLL yyyy, HH:mm")
    : sale.invoiceDate;

  return (
    <div className="flex w-full max-w-md flex-col gap-y-4 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-y-1 text-center">
        <span className="text-base font-semibold text-neutral-500">{sale.receiptNumber}</span>
        <span className="text-xs text-neutral-300">{formattedDate}</span>
      </div>

      <div className="border-t border-t-neutral-100" />

      <div className="flex flex-col gap-y-2">
        {sale.items.map((item) => (
          <div key={item.id} className="flex flex-col gap-y-0.5">
            <div className="flex flex-row items-baseline justify-between gap-x-3">
              <span className="flex-1 text-sm text-neutral-500">
                {item.qty}× {item.name}
              </span>
              <span className="text-sm text-neutral-300">
                <NumberDisplay value={item.price} />
              </span>
              <span className="w-24 text-right text-sm font-medium text-neutral-500">
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

      <div className="flex flex-row items-center justify-between text-sm">
        <span className="text-neutral-400">Pembayaran</span>
        <StatusChip label={sale.paymentGateway.title || "—"} variant="success" />
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
