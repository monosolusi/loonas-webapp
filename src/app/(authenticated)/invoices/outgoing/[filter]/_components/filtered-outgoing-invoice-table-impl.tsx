"use client";

import { useState } from "react";
import Image from "next/image";
import { useListInvoices } from "@/features/invoice/presentations/hooks/use-list-invoices";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { OutgoingInvoiceRow, OutgoingInvoiceTable } from "../../_components/outgoing-invoice-table";

interface FilteredOutgoingInvoiceTableImplProps {
  filter: string;
}

export function FilteredOutgoingInvoiceTableImpl({ filter }: FilteredOutgoingInvoiceTableImplProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

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

  const searchContent = (
    <div className="flex flex-row items-center justify-end">
      <div className="flex flex-row items-center gap-x-2 rounded-lg border border-neutral-200 px-3 py-2">
        <Image src="/assets/images/search-icon-neutral-400-w20-h20.svg" alt="Search" width={20} height={20} />
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Cari nomor faktur atau nama klien..."
          className="w-64 text-sm leading-5 text-neutral-500 outline-none placeholder:text-neutral-300"
        />
      </div>
    </div>
  );

  const tableHeader = (
    <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_1fr] border-b border-neutral-100 bg-neutral-50 px-6 py-3">
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Client</span>
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">No. Faktur</span>
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Jatuh Tempo</span>
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Status</span>
      <span className="text-right text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Total</span>
    </div>
  );

  if (loading) {
    return (
      <>
        {searchContent}
        <div className="overflow-hidden rounded-xl border border-neutral-100">
          {tableHeader}
          <div className="flex items-center justify-center py-12">
            <span className="text-sm text-neutral-300">Memuat data...</span>
          </div>
        </div>
      </>
    );
  }

  if (error || !invoices || !meta) {
    return (
      <>
        {searchContent}
        <div className="overflow-hidden rounded-xl border border-neutral-100">
          {tableHeader}
          <div className="flex items-center justify-center py-12">
            <span className="text-sm text-neutral-300">Gagal memuat data faktur.</span>
          </div>
        </div>
      </>
    );
  }

  if (invoices.length === 0) {
    return (
      <>
        {searchContent}
        <div className="overflow-hidden rounded-xl border border-neutral-100">
          {tableHeader}
          <div className="flex items-center justify-center py-12">
            <span className="text-sm text-neutral-300">Belum ada faktur keluar.</span>
          </div>
        </div>
      </>
    );
  }

  const outgoingInvoices = invoices.filter(
    (inv): inv is OutgoingInvoiceEntity => inv instanceof OutgoingInvoiceEntity,
  );

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
    <>
      {searchContent}
      <div className="overflow-hidden rounded-xl border border-neutral-100">
        {tableHeader}
        <OutgoingInvoiceTable rows={rows} meta={meta} currentPage={page} onPageChange={setPage} />
      </div>
    </>
  );
}
