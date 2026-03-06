import { OutgoingInvoiceStatus } from "@/features/invoice/domain/enums/outgoing-invoice-status";
import { PaginationMeta } from "@/core/resources/paginated";
import Link from "next/link";
import { InvoiceStatusChip } from "@/app/(authenticated)/invoices/_components/invoice-status-chip";
import { TablePagination } from "@/app/(authenticated)/invoices/_components/table-pagination";

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

export function OutgoingInvoiceTable({ rows, meta, currentPage, onPageChange }: OutgoingInvoiceTableProps) {
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
            <InvoiceStatusChip status={invoice.status} compact />
          </div>
          <span className="text-right text-sm leading-5 font-semibold text-neutral-500">{invoice.amount}</span>
        </Link>
      ))}

      {/* Table Footer */}
      <TablePagination displayedCount={rows.length} meta={meta} currentPage={currentPage} onPageChange={onPageChange} />
    </>
  );
}
