"use client";

import { InvoiceRow, InvoiceTable } from "@/app/(authenticated)/invoices/_components/invoice-table";
import { useMemo } from "react";
import { useCombinedInvoiceSummary } from "@/features/invoice/presentations/hooks/use-combined-invoice-summary";

export function InvoiceTableImpl() {
  const { invoices } = useCombinedInvoiceSummary();

  const formattedInvoices = useMemo((): InvoiceRow[] => {
    return invoices.map((invoice) => ({
      id: invoice.id,
      displayId: invoice.id.split("-").at(0)?.toUpperCase() ?? invoice.id,
      type: invoice.type,
      partnerName: invoice.partnerName,
      total: invoice.total,
      status: invoice.status,
      createdAt: invoice.createdAt,
    }));
  }, [invoices]);

  return <InvoiceTable data={formattedInvoices} />;
}
