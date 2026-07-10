"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { useListInvoices } from "@/features/invoice/presentations/hooks/use-list-invoices";
import { DEFAULT_PAGE_SIZE } from "@/core/utilities/pagination";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { InvoiceSearchInput } from "@/app/(authenticated)/invoices/_components/invoice-search-input";
import { InvoiceTableShell } from "@/app/(authenticated)/invoices/_components/invoice-table-shell";
import { TabFilter } from "@/core/presentations/components/tab-filter";
import { OutgoingInvoiceRow, OutgoingInvoiceTable } from "@/app/(authenticated)/invoices/outgoing/_components/outgoing-invoice-table";

interface OutgoingInvoiceTableImplProps {
  filter?: string;
}

const FILTER_TABS = ["Semua", "Belum Lunas", "Menunggu Settlement", "Lunas"] as const;
const filterMap = [undefined, "unpaid", "waiting_settlement", "paid"] as const;

function tabForStatus(status: string | null): number {
  const index = filterMap.indexOf(status as (typeof filterMap)[number]);
  return index > 0 ? index : 0;
}

export function OutgoingInvoiceTableImpl({ filter }: OutgoingInvoiceTableImplProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const showsTabs = !filter;
  const statusParam = searchParams.get("status");

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(() => (showsTabs ? tabForStatus(statusParam) : 0));

  const resolvedFilter = filter ?? filterMap[activeTab];

  // Keep the active tab in sync with the URL: a card clicked while already on the page, or browser back/forward.
  useEffect(() => {
    if (!showsTabs) return;
    setActiveTab(tabForStatus(statusParam));
    setSearch("");
    setPage(1);
  }, [statusParam, showsTabs]);

  const { invoices, meta, loading, error } = useListInvoices({
    type: InvoiceType.OUTGOING,
    page,
    limit: DEFAULT_PAGE_SIZE,
    filter: resolvedFilter,
  });

  const handleTabChange = (index: number) => {
    const status = filterMap[index];
    const params = new URLSearchParams(searchParams.toString());
    if (status) params.set("status", status);
    else params.delete("status");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const toolbar = (
    <div className={clsx("flex flex-row items-center", showsTabs ? "justify-between" : "justify-end")}>
      {showsTabs && <TabFilter tabs={FILTER_TABS} selectedIndex={activeTab} onChange={handleTabChange} />}

      <InvoiceSearchInput value={search} onChange={handleSearchChange} placeholder="Filter halaman ini..." />
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
      error={!!error}
      empty={invoices?.length === 0}
      emptyMessage="Belum ada faktur keluar."
      filteredEmpty={!!search && rows.length === 0}
    >
      {hasData && <OutgoingInvoiceTable rows={rows} meta={meta} currentPage={page} onPageChange={setPage} />}
    </InvoiceTableShell>
  );
}
