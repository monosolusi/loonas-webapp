"use client";

import { InvoiceTable, TableItem } from "@/app/(authenticated)/clients/[id]/invoices/invoice-table";
import { useMemo } from "react";
import { useListPartnerInvoice } from "@/features/partner/presentation/providers/list-partner-invoice";

export function InvoiceTableImpl() {
  const { invoices, loading } = useListPartnerInvoice();

  const formattedData: TableItem[] = useMemo(() => {
    return invoices.map((invoice) => ({
      invoiceId: invoice.id,
      amount: invoice.amount,
      status: invoice.status,
      createdAt: invoice.createdAt
    }));
  }, [invoices]);

  if (!invoices || loading) return null;
  return <InvoiceTable data={formattedData} />;
}
