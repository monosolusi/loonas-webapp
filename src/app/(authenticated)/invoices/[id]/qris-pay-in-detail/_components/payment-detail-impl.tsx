"use client";

import { PaymentDetail } from "@/app/(authenticated)/invoices/_components/payment-detail";
import { useParams } from "next/navigation";
import { useGetInvoice } from "@/features/invoice/presentations/hooks/use-get-invoice";

export function PaymentDetailImpl() {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetInvoice({ id });

  if (!invoice || loading) return null;
  return (
    <PaymentDetail
      invoiceId={invoice.id}
      receiverName={invoice.receiver.name}
      bankName={invoice.bankAccount.bankName}
      accountNumber={invoice.bankAccount.accountNumber}
      accountHolderName={invoice.bankAccount.accountHolderName}
      total={invoice.amount}
      fee={invoice.fee}
      totalPayment={invoice.total}
      showActions={false}
    />
  );
}
