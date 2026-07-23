"use client";

import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { PosSalesError } from "@/features/invoice/presentations/components/pos-sales-error";
import { PosSalesTableRow } from "@/features/invoice/presentations/components/pos-sales-table-row";
import { usePosSalesList } from "@/app/(authenticated)/sales/pos/_providers/pos-sales-list-provider";

const COLUMNS = [
  { label: "No. Struk" },
  { label: "Tanggal" },
  { label: "Metode" },
  { label: "Pembayaran" },
  { label: "Settlement" },
  { label: "Item" },
  { label: "Total", align: "right" as const },
  { label: "" },
];

const GRID_COLUMNS_CLASS = "grid-cols-[2fr_1.5fr_1fr_1fr_1fr_0.5fr_1fr_24px] gap-x-4";

type PosSalesListTableProps = {
  onSelectSale: (invoiceId: string) => void;
};

export function PosSalesListTable({ onSelectSale }: PosSalesListTableProps) {
  const { invoices, meta, loading, error, page, setPage } = usePosSalesList();

  if (error) return <PosSalesError error={error} />;

  const posInvoices = invoices.filter((inv): inv is OutgoingInvoiceEntity => inv instanceof OutgoingInvoiceEntity);

  return (
    <TableContainer loading={loading} empty={!loading && posInvoices.length === 0} emptyMessage="Belum ada transaksi POS.">
      <TableHeader className={GRID_COLUMNS_CLASS} columns={COLUMNS} hideOnMobile />
      {posInvoices.map((invoice) => (
        <PosSalesTableRow key={invoice.id} invoice={invoice} onClick={onSelectSale} />
      ))}
      {meta && meta.totalPages > 1 && (
        <TablePagination displayedCount={posInvoices.length} meta={meta} currentPage={page} onPageChange={setPage} />
      )}
    </TableContainer>
  );
}