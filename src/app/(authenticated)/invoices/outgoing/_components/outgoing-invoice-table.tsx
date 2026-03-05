import { OutgoingInvoiceStatus } from "@/features/invoice/domain/enums/outgoing-invoice-status";
import { PaginationMeta } from "@/core/resources/paginated";
import clsx from "clsx";
import Link from "next/link";

export interface OutgoingInvoiceRow {
  id: string;
  client: string;
  invoiceNumber: string;
  dueDate: string;
  status: OutgoingInvoiceStatus;
  amount: string;
}

interface OutgoingInvoiceTableProps {
  rows: OutgoingInvoiceRow[];
  meta: PaginationMeta;
  currentPage: number;
  onPageChange: (page: number) => void;
}

function StatusChip({ status }: { status: OutgoingInvoiceStatus }) {
  const isPaid = status === "PAID" || status === "PENDING_BANK_TRANSFER";

  const config: Record<string, { label: string; className: string }> = {
    PAID: { label: "Lunas", className: "bg-success-50 text-success-500" },
    PENDING_BANK_TRANSFER: { label: "Lunas", className: "bg-success-50 text-success-500" },
    SENT: { label: "Terkirim", className: "bg-primary-50 text-primary-500" },
    DRAFT: { label: "Draft", className: "bg-neutral-100 text-neutral-400" },
    READY_TO_SEND: { label: "Siap Kirim", className: "bg-neutral-100 text-neutral-400" },
    CANCELLED: { label: "Dibatalkan", className: "bg-error-50 text-error-500" },
  };

  const { label, className } = config[status] ?? {
    label: status,
    className: "bg-neutral-100 text-neutral-400",
  };

  return (
    <span className={clsx("rounded-sm px-2 py-0.5 text-xs leading-4 font-medium", className)}>{label}</span>
  );
}

export function OutgoingInvoiceTable({ rows, meta, currentPage, onPageChange }: OutgoingInvoiceTableProps) {
  const totalPages = meta.totalPages;
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <>
      {/* Table Rows */}
      {rows.map((invoice) => (
        <Link
          key={invoice.id}
          href={`/invoices/${invoice.id}`}
          className="group hover:border-l-primary-300 hover:bg-primary-50 grid cursor-pointer grid-cols-[2fr_1.5fr_1fr_1fr_1fr] items-center border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 last:border-b-0"
        >
          <span className="truncate text-sm leading-5 font-semibold text-neutral-500">{invoice.client}</span>
          <span className="truncate text-sm leading-5 text-neutral-400">{invoice.invoiceNumber}</span>
          <span className="text-sm leading-5 text-neutral-400">{invoice.dueDate}</span>
          <div className="flex flex-row items-center gap-x-1.5">
            <StatusChip status={invoice.status} />
          </div>
          <span className="text-right text-sm leading-5 font-semibold text-neutral-500">{invoice.amount}</span>
        </Link>
      ))}

      {/* Table Footer */}
      <div className="flex flex-row items-center justify-between border-t border-neutral-100 px-6 py-3">
        <span className="text-sm leading-5 text-neutral-300">
          Menampilkan {rows.length} dari {meta.total} data
        </span>
        <div className="flex flex-row items-center gap-x-2">
          <button
            className="flex size-8 items-center justify-center rounded-lg text-neutral-200 hover:bg-neutral-100 disabled:opacity-50"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            &#8249;
          </button>
          {pageNumbers.map((page) => (
            <button
              key={page}
              className={clsx(
                "flex size-8 items-center justify-center rounded-full text-sm font-medium",
                page === currentPage
                  ? "bg-neutral-500 text-neutral-50"
                  : "text-neutral-200 hover:bg-neutral-100",
              )}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="flex size-8 items-center justify-center rounded-lg text-neutral-200 hover:bg-neutral-100 disabled:opacity-50"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            &#8250;
          </button>
        </div>
      </div>
    </>
  );
}
