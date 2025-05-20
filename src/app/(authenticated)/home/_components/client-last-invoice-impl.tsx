"use client";

import { ClientLastInvoice, LastInvoiceItem } from "@/app/(authenticated)/home/_components/client-last-invoice";
import { useListPartnerInvoice } from "@/features/partner/presentation/providers/list-partner-invoice";
import { useMemo } from "react";

export function ClientLastInvoiceImpl() {
  const { invoices } = useListPartnerInvoice();

  const formattedInvoice: LastInvoiceItem | undefined = useMemo(() => {
    return invoices.map((invoice) => ({
      id: invoice.id,
      date: invoice.createdAt,
      amount: invoice.amount,
      status: invoice.status
    })).at(0);
  }, [invoices]);

  return (
    <ClientLastInvoice data={formattedInvoice} />
  );
}
