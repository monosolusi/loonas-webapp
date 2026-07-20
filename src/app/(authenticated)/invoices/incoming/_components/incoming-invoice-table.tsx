import { InvoiceStatus } from "@/features/invoice/domain/entities/incoming-invoice";
import { PaginationMeta } from "@/core/resources/paginated";
import Link from "next/link";
import { InvoiceStatusChip } from "@/app/(authenticated)/invoices/_components/invoice-status-chip";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { MobileListCard } from "@/core/presentations/components/table/mobile-list-card";

export interface IncomingInvoiceRow {
  id: string;
  client: string;
  invoiceNumber: string;
  extraInvoices: number;
  date: string;
  status: InvoiceStatus;
  amount: string;
}

interface IncomingInvoiceTableProps {
  rows: IncomingInvoiceRow[];
  meta: PaginationMeta;
  currentPage: number;
  onPageChange: (page: number) => void;
}

function ExtraInvoicesBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-xs leading-4 font-medium text-neutral-300">
      +{count}
    </span>
  );
}

export function IncomingInvoiceTable({ rows, meta, currentPage, onPageChange }: IncomingInvoiceTableProps) {
  return (
    <>
      {/* Desktop: grid rows (lg and up) */}
      <div className="hidden lg:block">
        {rows.map((invoice) => (
          <Link
            key={invoice.id}
            href={`/invoices/incoming/${invoice.id}`}
            className="group hover:border-l-primary-300 hover:bg-primary-50 grid cursor-pointer grid-cols-[2fr_1.5fr_1fr_1.5fr_1fr] items-center border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 last:border-b-0"
          >
            <span className="truncate text-sm leading-5 font-semibold text-neutral-500">{invoice.client}</span>
            <div className="flex flex-row items-center gap-x-2">
              <span className="truncate text-sm leading-5 text-neutral-400">{invoice.invoiceNumber}</span>
              <ExtraInvoicesBadge count={invoice.extraInvoices} />
            </div>
            <span className="text-sm leading-5 text-neutral-400">{invoice.date}</span>
            <div className="flex flex-row items-center gap-x-1.5">
              <InvoiceStatusChip status={invoice.status} compact />
            </div>
            <span className="text-right text-sm leading-5 font-semibold text-neutral-500">{invoice.amount}</span>
          </Link>
        ))}
      </div>

      {/* Mobile: stacked cards (below lg) */}
      <div className="lg:hidden">
        {rows.map((invoice) => (
          <MobileListCard
            key={invoice.id}
            href={`/invoices/incoming/${invoice.id}`}
            title={invoice.client}
            subtitle={
              <>
                <span className="truncate">{invoice.invoiceNumber}</span>
                <ExtraInvoicesBadge count={invoice.extraInvoices} />
              </>
            }
            meta={invoice.date}
            trailingTop={invoice.amount}
            trailingBottom={<InvoiceStatusChip status={invoice.status} compact />}
          />
        ))}
      </div>

      <TablePagination displayedCount={rows.length} meta={meta} currentPage={currentPage} onPageChange={onPageChange} />
    </>
  );
}
