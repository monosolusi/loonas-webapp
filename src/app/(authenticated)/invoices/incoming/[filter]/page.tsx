"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FilteredInvoicePageShell } from "@/app/(authenticated)/invoices/_components/filtered-invoice-page-shell";
import { FilteredIncomingInvoiceTableImpl } from "@/app/(authenticated)/invoices/incoming/[filter]/_components/filtered-incoming-invoice-table-impl";

const FILTER_CONFIG: Record<string, { title: string }> = {
  unpaid: { title: "Tagihan Belum Dibayar" },
  paid: { title: "Tagihan Telah Dibayar" },
};

export default function IncomingFilteredInvoicePage() {
  const { filter } = useParams<{ filter: string }>();
  const router = useRouter();

  const config = FILTER_CONFIG[filter];

  useEffect(() => {
    if (!config) router.replace("/invoices/incoming");
  }, [config, router]);

  if (!config) return null;

  return (
    <FilteredInvoicePageShell backHref="/invoices/incoming" title={config.title}>
      <FilteredIncomingInvoiceTableImpl filter={filter} />
    </FilteredInvoicePageShell>
  );
}
