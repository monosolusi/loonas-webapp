"use client";

import { InvoiceRow, RecentInvoicesTable } from "@/app/(authenticated)/home/_components/recent-invoices-table";
import { useMemo } from "react";
import { useCombinedInvoiceSummary } from "@/features/invoice/presentations/hooks/use-combined-invoice-summary";

export function RecentInvoiceTableImpl() {
  const { invoices, error } = useCombinedInvoiceSummary();

  const formattedInvoices: InvoiceRow[] = useMemo(() => {
    if (error) return [];
    return invoices.slice(0, 5).map((invoice) => ({
      id: invoice.id,
      type: invoice.type,
      partnerName: invoice.partnerName,
      status: invoice.status,
      total: invoice.total,
      createdAt: invoice.createdAt,
    }));
  }, [invoices, error]);

  return <RecentInvoicesTable data={formattedInvoices} />;
}
