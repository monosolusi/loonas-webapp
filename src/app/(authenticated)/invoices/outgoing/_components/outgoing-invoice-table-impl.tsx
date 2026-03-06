"use client";

import { useState } from "react";
import { Tab, TabGroup, TabList } from "@headlessui/react";
import { useListInvoices } from "@/features/invoice/presentations/hooks/use-list-invoices";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { InvoiceSearchInput } from "@/app/(authenticated)/invoices/_components/invoice-search-input";
import { InvoiceTableShell } from "@/app/(authenticated)/invoices/_components/invoice-table-shell";
import { OutgoingInvoiceRow, OutgoingInvoiceTable } from "./outgoing-invoice-table";

export function OutgoingInvoiceTableImpl() {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");

  const filterMap = [undefined, "unpaid", "paid"] as const;

  const { invoices, meta, loading, error } = useListInvoices({
    type: InvoiceType.OUTGOING,
    page,
    limit: 5,
    filter: filterMap[activeTab],
  });

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const toolbar = (
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
