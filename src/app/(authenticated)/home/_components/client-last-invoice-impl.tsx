"use client";

import { ClientLastInvoice, LastInvoiceItem } from "@/app/(authenticated)/home/_components/client-last-invoice";
import { useMemo } from "react";
import { useListPartnerInvoice } from "@/features/partner/presentation/hooks/use-list-partner-invoice";

type ClientLastInvoiceImplProps = {
  partner: { id: string };
};

export function ClientLastInvoiceImpl(props: ClientLastInvoiceImplProps) {
  const { invoices, loading } = useListPartnerInvoice({ partner: { id: props.partner.id } });

  const formattedInvoice: LastInvoiceItem | undefined = useMemo(() => {
    if (loading) return undefined;
    if (!invoices) return undefined;

    return invoices
      .map((invoice) => ({
        id: invoice.id,
        date: invoice.createdAt,
        amount: invoice.amount,
        status: invoice.status,
      }))
      .at(0);
  }, [invoices, loading]);

  return <ClientLastInvoice data={formattedInvoice} />;
}
