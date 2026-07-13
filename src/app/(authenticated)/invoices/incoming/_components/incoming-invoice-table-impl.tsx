"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import clsx from "clsx";
import { useListInvoices } from "@/features/invoice/presentations/hooks/use-list-invoices";
import { DEFAULT_PAGE_SIZE } from "@/core/utilities/pagination";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { IncomingInvoiceEntity } from "@/features/invoice/domain/entities/incoming-invoice";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { InvoiceSearchInput } from "@/app/(authenticated)/invoices/_components/invoice-search-input";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TabFilter } from "@/core/presentations/components/tab-filter";
import { IncomingInvoiceRow, IncomingInvoiceTable } from "@/app/(authenticated)/invoices/incoming/_components/incoming-invoice-table";

interface IncomingInvoiceTableImplProps {
  filter?: string;
}

const FILTER_TABS = ["Semua", "Belum Lunas", "Menunggu Settlement", "Lunas"] as const;
const filterMap = [undefined, "unpaid", "waiting_settlement", "paid"] as const;

function tabForStatus(status: string | null): number {
  const index = filterMap.indexOf(status as (typeof filterMap)[number]);
  return index > 0 ? index : 0;
}

export function IncomingInvoiceTableImpl({ filter }: IncomingInvoiceTableImplProps) {
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
    type: InvoiceType.INCOMING,
    page,
    limit: DEFAULT_PAGE_SIZE,
    includes: "documents",
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

      <InvoiceSearchInput
        value={search}
        onChange={handleSearchChange}
        placeholder="Filter halaman ini..."
      />
    </div>
  );

  const header = (
    <TableHeader
      columns={[
        { label: "Client" },
        { label: "No. Faktur" },
        { label: "Tgl. Terima" },
        { label: "Status" },
        { label: "Total Tagihan", align: "right" },
      ]}
      className="grid-cols-[2fr_1.5fr_1fr_1.5fr_1fr]"
    />
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
    <>
      {toolbar}

      <TableContainer
        loading={loading}
        error={!!error}
        empty={invoices?.length === 0}
        emptyMessage="Belum ada faktur masuk."
        filteredEmpty={!!search && rows.length === 0}
      >
        {header}
        {hasData && <IncomingInvoiceTable rows={rows} meta={meta} currentPage={page} onPageChange={setPage} />}
      </TableContainer>
    </>
  );
}
