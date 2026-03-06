"use client";

import { useEffect, useState } from "react";
import { useListInvoices } from "@/features/invoice/presentations/hooks/use-list-invoices";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { InvoiceSearchInput } from "@/app/(authenticated)/invoices/_components/invoice-search-input";
import { InvoiceTableShell } from "@/app/(authenticated)/invoices/_components/invoice-table-shell";
import { OutgoingInvoiceRow, OutgoingInvoiceTable } from "../../_components/outgoing-invoice-table";

interface FilteredOutgoingInvoiceTableImplProps {
  filter: string;
}

export function FilteredOutgoingInvoiceTableImpl({ filter }: FilteredOutgoingInvoiceTableImplProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch("");
    setPage(1);
  }, [filter]);

  const { invoices, meta, loading, error } = useListInvoices({
    type: InvoiceType.OUTGOING,
    page,
    limit: 5,
    filter,
  });

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const toolbar = (
    <div className="flex flex-row items-center justify-end">
      <InvoiceSearchInput value={search} onChange={handleSearchChange} placeholder="Cari nomor faktur atau nama klien..." />
    </div>
  );

  const header = (
    <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr] border-b border-neutral-100 bg-neutral-50 px-6 py-3">
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Client</span>
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">No. Faktur</span>
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Jatuh Tempo</span>
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Status</span>
      <span className="text-right text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Total</span>
    </div>
  );

  const hasData = !loading && !error && invoices && meta;
  const outgoingInvoices = hasData
    ? invoices.filter((inv): inv is OutgoingInvoiceEntity => inv instanceof OutgoingInvoiceEntity)
    : [];

  const filteredInvoices = search
    ? outgoingInvoices.filter((invoice) => {
        const query = search.toLowerCase();
        const matchesName = invoice.recipient.fullName.toLowerCase().includes(query);
        const matchesInvoiceNumber = invoice.invoiceNumber?.toLowerCase().includes(query) ?? false;
        return matchesName || matchesInvoiceNumber;
      })
    : outgoingInvoices;

  const rows: OutgoingInvoiceRow[] = filteredInvoices.map((invoice) => ({
    id: invoice.id,
    client: invoice.recipient.fullName,
    invoiceNumber: invoice.invoiceNumber ?? "-",
    dueDate: invoice.dueDate.setLocale("id").toFormat("dd LLL yyyy"),
    status: invoice.status,
    amount: IDRFormatter.toCurrency(invoice.summary.total),
  }));

  return (
    <InvoiceTableShell
      toolbar={toolbar}
      header={header}
      loading={loading}
      error={!!error || !invoices || !meta}
      empty={invoices?.length === 0}
      emptyMessage="Belum ada faktur keluar."
    >
      {hasData && <OutgoingInvoiceTable rows={rows} meta={meta} currentPage={page} onPageChange={setPage} />}
    </InvoiceTableShell>
  );
}
