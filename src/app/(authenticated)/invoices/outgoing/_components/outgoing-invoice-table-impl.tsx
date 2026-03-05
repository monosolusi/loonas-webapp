"use client";

import { useState } from "react";
import { Tab, TabGroup, TabList } from "@headlessui/react";
import Image from "next/image";
import { useListInvoices } from "@/features/invoice/presentations/hooks/use-list-invoices";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { OutgoingInvoiceRow, OutgoingInvoiceTable } from "./outgoing-invoice-table";

export function OutgoingInvoiceTableImpl() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");

  const { invoices, meta, loading, error } = useListInvoices({
    type: InvoiceType.OUTGOING,
    page,
    limit: 5,
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
            <span className="text-sm text-neutral-300">Belum ada faktur keluar.</span>
          </div>
        </div>
      </>
    );
  }

  const outgoingInvoices = invoices.filter(
    (inv): inv is OutgoingInvoiceEntity => inv instanceof OutgoingInvoiceEntity,
  );

  const filteredInvoices = outgoingInvoices.filter((invoice) => {
    const isPaid = invoice.status === "PAID" || invoice.status === "PENDING_BANK_TRANSFER";
    const isCancelled = invoice.status === "CANCELLED";

    if (activeTab === 1 && (isPaid || isCancelled)) return false;
    if (activeTab === 2 && !isPaid) return false;

    if (search) {
      const query = search.toLowerCase();
      const matchesName = invoice.recipient.fullName.toLowerCase().includes(query);
      const matchesInvoiceNumber = invoice.invoiceNumber?.toLowerCase().includes(query) ?? false;
      if (!matchesName && !matchesInvoiceNumber) return false;
    }

    return true;
  });

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
      {filterContent}
      <div className="overflow-hidden rounded-xl border border-neutral-100">
        {tableHeader}
        <OutgoingInvoiceTable rows={rows} meta={meta} currentPage={page} onPageChange={setPage} />
      </div>
    </>
  );
}
