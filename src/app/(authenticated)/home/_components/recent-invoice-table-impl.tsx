"use client";

import { InvoiceRow, RecentInvoicesTable } from "@/app/(authenticated)/home/_components/recent-invoices-table";
import { useMemo } from "react";
import { useInvoice } from "@/features/invoice/presentations/providers/invoice";

export function RecentInvoiceTableImpl() {
  const { invoices } = useInvoice();

  const formattedInvoices: InvoiceRow[] = useMemo(() => {
    return invoices.map((invoice) => ({
      id: invoice.id,
      receiverName: invoice.receiver.name,
      status: invoice.status,
      total: invoice.amount,
      createdAt: invoice.createdAt
    }));
  }, [invoices]);

  return (
    <RecentInvoicesTable data={formattedInvoices} />
  );
}
