"use client";

import { useState } from "react";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { InvoiceChannel } from "@/features/invoice/domain/enums/invoice-channel";
import { useListInvoices } from "@/features/invoice/presentations/hooks/use-list-invoices";
import { PosSalesError } from "@/features/invoice/presentations/components/pos-sales-error";
import { PosSalesTableRow } from "@/features/invoice/presentations/components/pos-sales-table-row";

const PAGE_SIZE = 25;

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

type PosSalesListProps = {
  onSelectSale: (invoiceId: string) => void;
};

export function PosSalesList({ onSelectSale }: PosSalesListProps) {
  const [page, setPage] = useState(1);
  const state = useListInvoices({ channel: InvoiceChannel.POS, page, limit: PAGE_SIZE });

  if (state.error) return <PosSalesError error={state.error} />;

  const invoices = state.invoices ?? [];
  const meta = state.meta;
  const posInvoices = invoices.filter((inv): inv is OutgoingInvoiceEntity => inv instanceof OutgoingInvoiceEntity);

  return (
    <TableContainer
      loading={state.loading}
      empty={!state.loading && posInvoices.length === 0}
      emptyMessage="Belum ada transaksi POS."
    >
      <TableHeader className={GRID_COLUMNS_CLASS} columns={COLUMNS} />
      {posInvoices.map((invoice) => (
        <PosSalesTableRow key={invoice.id} invoice={invoice} onClick={onSelectSale} />
      ))}
      {meta && meta.totalPages > 1 && (
        <TablePagination
          displayedCount={posInvoices.length}
          meta={meta}
          currentPage={page}
          onPageChange={setPage}
        />
      )}
    </TableContainer>
  );
}
