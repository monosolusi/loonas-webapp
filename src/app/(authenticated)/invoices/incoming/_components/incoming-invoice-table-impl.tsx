"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { useListInvoices } from "@/features/invoice/presentations/hooks/use-list-invoices";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { IncomingInvoiceEntity } from "@/features/invoice/domain/entities/incoming-invoice";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { InvoiceSearchInput } from "@/app/(authenticated)/invoices/_components/invoice-search-input";
import { InvoiceTableShell } from "@/app/(authenticated)/invoices/_components/invoice-table-shell";
import { InvoiceTabFilter } from "@/app/(authenticated)/invoices/_components/invoice-tab-filter";
import { IncomingInvoiceRow, IncomingInvoiceTable } from "@/app/(authenticated)/invoices/incoming/_components/incoming-invoice-table";

interface IncomingInvoiceTableImplProps {
  filter?: string;
}

export function IncomingInvoiceTableImpl({ filter }: IncomingInvoiceTableImplProps) {
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");

  const filterMap = [undefined, "unpaid", "paid"] as const;
  const resolvedFilter = filter ?? filterMap[activeTab];

  useEffect(() => {
    setSearch("");
    setPage(1);
  }, [filter]);

  const { invoices, meta, loading, error } = useListInvoices({
    type: InvoiceType.INCOMING,
    page,
    limit: 5,
    includes: "documents",
    filter: resolvedFilter,
  });

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setSearch("");
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const toolbar = (
    <div className={clsx("flex flex-row items-center", filter ? "justify-end" : "justify-between")}>
      {!filter && <InvoiceTabFilter selectedIndex={activeTab} onChange={handleTabChange} />}

      <InvoiceSearchInput
        value={search}
        onChange={handleSearchChange}
        placeholder="Filter halaman ini..."
      />
    </div>
  );

  const header = (
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

  const hasData = !loading && !error && invoices && meta;
  const incomingInvoices = hasData
    ? invoices.filter((inv): inv is IncomingInvoiceEntity => inv instanceof IncomingInvoiceEntity)
    : [];

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
    const extraCount = Math.max((invoice.documents?.length ?? 0) - 1, 0);

    return {
      id: invoice.id,
      client: invoice.receiver.name,
      invoiceNumber: firstDoc?.invoiceNumber ?? "-",
      extraInvoices: extraCount,
      date: invoice.createdAt.setLocale("id").toFormat("dd LLL yyyy"),
      status: invoice.status,
      amount: IDRFormatter.toCurrency(invoice.total),
    };
  });

  return (
    <InvoiceTableShell
      toolbar={toolbar}
      header={header}
      loading={loading}
      error={!!error}
      empty={invoices?.length === 0}
      emptyMessage="Belum ada faktur masuk."
      filteredEmpty={!!search && rows.length === 0}
    >
      {hasData && <IncomingInvoiceTable rows={rows} meta={meta} currentPage={page} onPageChange={setPage} />}
    </InvoiceTableShell>
  );
}
