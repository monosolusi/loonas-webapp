"use client";

import { useState } from "react";
import { Tab, TabGroup, TabList } from "@headlessui/react";
import Image from "next/image";
import { useListInvoices } from "@/features/invoice/presentations/hooks/use-list-invoices";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { InvoiceEntity } from "@/features/invoice/domain/entities/invoice";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { IncomingInvoiceRow, IncomingInvoiceTable } from "./incoming-invoice-table";

export function IncomingInvoiceTableImpl() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");

  const { invoices, meta, loading, error } = useListInvoices({
    type: InvoiceType.INCOMING,
    page,
    limit: 5,
    includes: "documents",
  });

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const filterContent = (
    <div className="flex flex-row items-center justify-between">
      <TabGroup selectedIndex={activeTab} onChange={handleTabChange}>
        <TabList className="flex flex-row rounded-lg bg-neutral-100 p-1">
          {["Semua", "Belum Lunas", "Lunas"].map((label) => (
            <Tab
              key={label}
              className={({ selected }) =>
                `rounded-md px-4 py-1.5 text-sm leading-5 outline-none ${
                  selected ? "bg-white text-neutral-500 shadow-sm" : "text-neutral-300 hover:text-neutral-400"
                }`
              }
            >
              {label}
            </Tab>
          ))}
        </TabList>
      </TabGroup>

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
        {filterContent}
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
        {filterContent}
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
        {filterContent}
        <div className="overflow-hidden rounded-xl border border-neutral-100">
          {tableHeader}
          <div className="flex items-center justify-center py-12">
            <span className="text-sm text-neutral-300">Belum ada faktur masuk.</span>
          </div>
        </div>
      </>
    );
  }

  const incomingInvoices = invoices.filter((inv): inv is InvoiceEntity => inv instanceof InvoiceEntity);

  const filteredInvoices = incomingInvoices.filter((invoice) => {
    const isPaid = invoice.status === "COMPLETED" || invoice.status === "PAID";

    if (activeTab === 1 && isPaid) return false;
    if (activeTab === 2 && !isPaid) return false;

    if (search) {
      const query = search.toLowerCase();
      const matchesName = invoice.receiver.name.toLowerCase().includes(query);
      const matchesInvoiceNumber = invoice.documents?.[0]?.invoiceNumber?.toLowerCase().includes(query) ?? false;
      if (!matchesName && !matchesInvoiceNumber) return false;
    }

    return true;
  });

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
      {filterContent}
      <div className="overflow-hidden rounded-xl border border-neutral-100">
        {tableHeader}
        <IncomingInvoiceTable rows={rows} meta={meta} currentPage={page} onPageChange={setPage} />
      </div>
    </>
  );
}
