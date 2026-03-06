"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useListInvoices } from "@/features/invoice/presentations/hooks/use-list-invoices";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { IncomingInvoiceEntity } from "@/features/invoice/domain/entities/incoming-invoice";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { IncomingInvoiceRow, IncomingInvoiceTable } from "../../_components/incoming-invoice-table";

interface FilteredIncomingInvoiceTableImplProps {
  filter: string;
}

export function FilteredIncomingInvoiceTableImpl({ filter }: FilteredIncomingInvoiceTableImplProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setSearch("");
    setPage(1);
  }, [filter]);

  const { invoices, meta, loading, error } = useListInvoices({
    type: InvoiceType.INCOMING,
    page,
    limit: 5,
    includes: "documents",
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
          placeholder="Cari nomor faktur atau nama pemasok..."
          className="w-64 text-sm leading-5 text-neutral-500 outline-none placeholder:text-neutral-300"
        />
      </div>
    </div>
  );

  const tableHeader = (
    <div className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr_1fr] border-b border-neutral-100 bg-neutral-50 px-6 py-3">
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Client</span>
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">No. Faktur</span>
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Tgl. Terima</span>
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Status</span>
      <span className="text-right text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">
        Total Tagihan
      </span>
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
            <span className="text-sm text-neutral-300">Belum ada faktur masuk.</span>
          </div>
        </div>
      </>
    );
  }

  const incomingInvoices = invoices.filter((inv): inv is IncomingInvoiceEntity => inv instanceof IncomingInvoiceEntity);

  const filteredInvoices = search
    ? incomingInvoices.filter((invoice) => {
        const query = search.toLowerCase();
        const matchesName = invoice.receiver.name.toLowerCase().includes(query);
        const matchesInvoiceNumber = invoice.documents?.[0]?.invoiceNumber?.toLowerCase().includes(query) ?? false;
        return matchesName || matchesInvoiceNumber;
      })
    : incomingInvoices;

  const rows: IncomingInvoiceRow[] = filteredInvoices.map((invoice) => {
    const firstDoc = invoice.documents?.[0];
    const extraCount = (invoice.documents?.length ?? 1) - 1;

    return {
      id: invoice.id,
      client: invoice.receiver.name,
      invoiceNumber: firstDoc?.invoiceNumber ?? "-",
      extraInvoices: extraCount > 0 ? extraCount : 0,
      date: invoice.createdAt.setLocale("id").toFormat("dd LLL yyyy"),
      status: invoice.status,
      amount: IDRFormatter.toCurrency(invoice.total),
    };
  });

  return (
    <>
      {searchContent}
      <div className="overflow-hidden rounded-xl border border-neutral-100">
        {tableHeader}
        <IncomingInvoiceTable rows={rows} meta={meta} currentPage={page} onPageChange={setPage} />
      </div>
    </>
  );
}
