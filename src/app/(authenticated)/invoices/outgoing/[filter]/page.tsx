"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FilteredInvoicePageShell } from "@/app/(authenticated)/invoices/_components/filtered-invoice-page-shell";
import { FilteredOutgoingInvoiceTableImpl } from "@/app/(authenticated)/invoices/outgoing/[filter]/_components/filtered-outgoing-invoice-table-impl";

const FILTER_CONFIG: Record<string, { title: string }> = {
  unpaid: { title: "Faktur Belum Dibayar" },
  paid: { title: "Faktur Telah Dibayar" },
  overdue: { title: "Faktur Jatuh Tempo" },
};

export default function OutgoingFilteredInvoicePage() {
  const { filter } = useParams<{ filter: string }>();
  const router = useRouter();

  const config = FILTER_CONFIG[filter];

  useEffect(() => {
    if (!config) router.replace("/invoices/outgoing");
  }, [config, router]);

  if (!config) return null;

  return (
    <FilteredInvoicePageShell backHref="/invoices/outgoing" title={config.title}>
      <FilteredOutgoingInvoiceTableImpl filter={filter} />
    </FilteredInvoicePageShell>
  );
}
