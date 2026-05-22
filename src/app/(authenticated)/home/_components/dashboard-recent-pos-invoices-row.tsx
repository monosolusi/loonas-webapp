"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { deriveInvoicePaymentStatusKind } from "@/features/invoice/presentations/components/invoice-payment-helpers";

type DashboardRecentPosInvoicesRowProps = {
  invoice: OutgoingInvoiceEntity;
};

export function DashboardRecentPosInvoicesRow({ invoice }: DashboardRecentPosInvoicesRowProps) {
  const router = useRouter();
  const isPaid = deriveInvoicePaymentStatusKind(invoice) === "paid";

  return (
    <div
      onClick={() => router.push(`/invoices/outgoing/${invoice.id}`)}
      className={clsx(
        "grid cursor-pointer grid-cols-[2fr_1fr_1fr] items-center border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 last:border-b-0",
        "hover:border-l-primary-300 hover:bg-primary-50",
        "transition-colors duration-150",
      )}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <span className="truncate text-sm leading-5 font-semibold text-neutral-500">{invoice.invoiceNumber}</span>
        <span className="text-xs leading-4 text-neutral-300">
          {invoice.createdAt.setLocale("id").toRelative()}
        </span>
      </div>
      <span className="text-sm leading-5 font-semibold text-neutral-500">
        {IDRFormatter.toCurrency(invoice.summary.total)}
      </span>
      <span className={clsx("text-sm leading-5 font-medium", isPaid ? "text-success-500" : "text-warning-500")}>
        {isPaid ? "Lunas" : "Menunggu Pembayaran"}
      </span>
    </div>
  );
}
