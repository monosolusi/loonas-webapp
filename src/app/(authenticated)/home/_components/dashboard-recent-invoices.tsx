"use client";

import { useState } from "react";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { useListInvoices } from "@/features/invoice/presentations/hooks/use-list-invoices";
import { DashboardRecentInvoicesFilters } from "@/app/(authenticated)/home/_components/dashboard-recent-invoices-filters";
import { DashboardRecentInvoicesLoading } from "@/app/(authenticated)/home/_components/dashboard-recent-invoices-loading";
import { DashboardRecentInvoicesError } from "@/app/(authenticated)/home/_components/dashboard-recent-invoices-error";
import { DashboardRecentInvoicesEmpty } from "@/app/(authenticated)/home/_components/dashboard-recent-invoices-empty";
import { DashboardRecentInvoicesLoaded } from "@/app/(authenticated)/home/_components/dashboard-recent-invoices-loaded";

export function DashboardRecentInvoices() {
  const [activeFilter, setActiveFilter] = useState<InvoiceType | undefined>(undefined);
  const result = useListInvoices({ type: activeFilter, limit: 7, includes: "documents" });

  const filterChips = (
    <DashboardRecentInvoicesFilters activeFilter={activeFilter} onFilterChange={setActiveFilter} />
  );

  if (result.loading) {
    return <DashboardRecentInvoicesLoading headerAction={filterChips} />;
  }

  if (result.error) {
    return <DashboardRecentInvoicesError headerAction={filterChips} />;
  }

  if (result.invoices.length === 0) {
    return <DashboardRecentInvoicesEmpty headerAction={filterChips} />;
  }

  return <DashboardRecentInvoicesLoaded invoices={result.invoices} headerAction={filterChips} />;
}
