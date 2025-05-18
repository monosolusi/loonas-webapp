"use client";

import {InvoiceRow, InvoiceTable} from "@/app/(authenticated)/invoices/_components/invoice-table";
import {useInvoice} from "@/features/invoice/presentations/providers/invoice";
import {useMemo} from "react";

export function InvoiceTableImpl() {
  const {invoices} = useInvoice();

  const formattedInvoices = useMemo((): InvoiceRow[] => {
    return invoices.map((invoice) => ({
      id: invoice.id,
      type: invoice.type,
      receiverName: invoice.receiver.name,
      bankAccount: {
        bankName: invoice.bankAccount.bankName,
        accountNumber: invoice.bankAccount.accountNumber,
        accountHolderName: invoice.bankAccount.accountHolderName
      },
      total: invoice.amount,
      status: invoice.status,
      paymentMethod: invoice.paymentMethod.title,
      createdAt: invoice.createdAt,
    }));
  }, [invoices])

  return (
    <InvoiceTable
      data={formattedInvoices}
    />
  );
}
