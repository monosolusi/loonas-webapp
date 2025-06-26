"use client";

import { PaymentDetail } from "@/app/(authenticated)/invoices/_components/payment-detail";
import { useGetIncomingInvoice } from "@/features/invoice/presentations/hooks/use-get-incoming-invoice";
import { useParams } from "next/navigation";

export function PaymentDetailImpl() {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetIncomingInvoice({ id });

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
