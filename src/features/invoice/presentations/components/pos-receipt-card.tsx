"use client";

import { NumberDisplay } from "@/core/presentations/components/number-display";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { CashPayInDetailEntity } from "@/features/invoice/domain/entities/pay-in-detail/cash-pay-in-detail";
import { InvoicePaymentStatusChip } from "@/features/invoice/presentations/components/invoice-payment-status-chip";
import { InvoiceSettlementChip } from "@/features/invoice/presentations/components/invoice-settlement-chip";
import { PosReceiptLine } from "@/features/invoice/presentations/components/pos-receipt-line";
import { formatPosReceiptDateTime } from "@/core/utilities/datetime/format-pos-receipt-datetime";
import { idrSpeller } from "@/core/utilities/currency/idr-speller";
import {
  POS_RECEIPT_COPY,
  formatPosReceiptPayInMethodLabel,
} from "@/features/invoice/presentations/components/pos-receipt-card-copy";

type PosReceiptCardProps = {
  invoice: OutgoingInvoiceEntity;
};

export function PosReceiptCard({ invoice }: PosReceiptCardProps) {
  // TODO(LNS-199-followup): wire store timezone from account/org settings once BE exposes account.timezone — hardcoded for UNOFEST (Jakarta) launch.
  const formattedDate = formatPosReceiptDateTime(invoice.invoiceDate, "Asia/Jakarta");
  const methodType = invoice.payInDetail?.detail?.type;

  return (
    <div className="flex w-full flex-col gap-y-4 rounded-lg border border-neutral-200 bg-white p-6">
      <div className="flex flex-col gap-y-1 text-center">
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-300">
          {POS_RECEIPT_COPY.HEADER_LABEL}
        </span>
        <span className="text-base font-semibold text-neutral-500">{invoice.invoiceNumber}</span>
        <span className="text-xs text-neutral-300">{formattedDate}</span>
      </div>

      <div className="border-t border-t-neutral-100" />

      <div className="flex flex-col gap-y-2">
        {invoice.items.map((item) => (
          <PosReceiptLine key={item.id} item={item} />
        ))}
      </div>

      <div className="border-t border-t-neutral-100" />

      <div className="flex flex-col gap-y-1 text-sm">
        <div className="flex flex-row justify-between text-neutral-300">
          <span>{POS_RECEIPT_COPY.SUBTOTAL_LABEL}</span>
          <span>
            <NumberDisplay value={invoice.summary.amountBeforeTax} />
          </span>
        </div>
        <div className="flex flex-row items-baseline justify-between">
          <span className="text-sm font-semibold text-neutral-500">{POS_RECEIPT_COPY.TOTAL_LABEL}</span>
          <span className="text-xl font-bold tabular-nums text-neutral-500">
            <span aria-hidden="true">
              <NumberDisplay value={invoice.summary.total} suffix="IDR" />
            </span>
            <span className="sr-only">
              Total: {idrSpeller(invoice.summary.total)} rupiah
            </span>
          </span>
        </div>
      </div>

      <div className="border-t border-t-neutral-100" />

      <div className="flex flex-col gap-y-2 text-sm">
        <div className="flex flex-row items-center justify-between">
          <span className="text-neutral-300">{POS_RECEIPT_COPY.METHOD_LABEL}</span>
          <span className="text-neutral-500">{formatPosReceiptPayInMethodLabel(methodType)}</span>
        </div>
        {invoice.payInDetail?.detail instanceof CashPayInDetailEntity &&
          invoice.payInDetail.detail.changeAmount !== null && (
            <div className="flex flex-row items-center justify-between">
              <span className="text-neutral-300">{POS_RECEIPT_COPY.CHANGE_LABEL}</span>
              <span className="tabular-nums text-neutral-500">
                <NumberDisplay value={invoice.payInDetail.detail.changeAmount} suffix="IDR" />
              </span>
            </div>
          )}
        <div className="flex flex-row items-center justify-between">
          <span className="text-neutral-300">{POS_RECEIPT_COPY.STATUS_LABEL}</span>
          <InvoicePaymentStatusChip invoice={invoice} />
        </div>
        <div className="flex flex-row items-center justify-between">
          <span className="text-neutral-300">{POS_RECEIPT_COPY.SETTLEMENT_LABEL}</span>
          <InvoiceSettlementChip invoice={invoice} />
        </div>
        {invoice.recipient.fullName.trim().length > 0 && (
          <div className="flex flex-row items-center justify-between">
            <span className="text-neutral-300">{POS_RECEIPT_COPY.CUSTOMER_LABEL}</span>
            <span className="max-w-[60%] truncate text-right text-neutral-500">{invoice.recipient.fullName}</span>
          </div>
        )}
      </div>

      {invoice.note && (
        <>
          <div className="border-t border-t-neutral-100" />
          <div className="flex flex-col gap-y-1 text-sm">
            <span className="text-neutral-300">{POS_RECEIPT_COPY.NOTE_LABEL}</span>
            <span className="text-neutral-500">{invoice.note}</span>
          </div>
        </>
      )}
    </div>
  );
}
