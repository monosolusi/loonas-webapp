"use client";

import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { InvoicePaymentStatusChip } from "@/features/invoice/presentations/components/invoice-payment-status-chip";
import { InvoiceSettlementChip } from "@/features/invoice/presentations/components/invoice-settlement-chip";
import {
  formatInvoiceDateTime,
  formatPayInMethodLabel,
} from "@/features/invoice/presentations/components/invoice-payment-helpers";

type PosSalesTableRowProps = {
  invoice: OutgoingInvoiceEntity;
  onClick: (invoiceId: string) => void;
};

export function PosSalesTableRow({ invoice, onClick }: PosSalesTableRowProps) {
  const dateLabel = formatInvoiceDateTime(invoice.invoiceDate);
  const itemCount = invoice.items.reduce((sum, item) => sum + item.qty, 0);
  const methodType = invoice.payInDetail?.detail?.type;
  const methodLabel = formatPayInMethodLabel(methodType);

  return (
    <button
      type="button"
      onClick={() => onClick(invoice.id)}
      className="hover:border-l-primary-300 hover:bg-primary-50 grid w-full grid-cols-[2fr_1.5fr_1fr_1fr_1fr_0.5fr_1fr_24px] cursor-pointer items-center gap-x-4 border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 text-left transition-colors last:border-b-0"
    >
      <span className="truncate text-sm font-medium text-neutral-500">{invoice.invoiceNumber}</span>
      <span className="text-sm tabular-nums text-neutral-400">{dateLabel}</span>
      <span className="truncate text-sm text-neutral-400">{methodLabel}</span>
      <span>
        <InvoicePaymentStatusChip invoice={invoice} />
      </span>
      <span>
        <InvoiceSettlementChip invoice={invoice} />
      </span>
      <span className="text-sm tabular-nums text-neutral-400">{itemCount}</span>
      <span className="text-right text-sm font-semibold tabular-nums text-neutral-500">
        Rp <NumberDisplay value={invoice.summary.total} />
      </span>
      <ChevronRightIcon className="size-4 text-neutral-300" />
    </button>
  );
}
