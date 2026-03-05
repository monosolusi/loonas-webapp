"use client";

import { useGetInvoice } from "@/features/invoice/presentations/hooks/use-get-invoice";
import { PaymentInformation } from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/payment-information";
import { isIncomingInvoice } from "@/features/invoice/domain/guards/invoice-guards";

interface PaymentInformationImplProps {
  id: string;
}

export function PaymentInformationImpl({ id }: PaymentInformationImplProps) {
  const { invoice, loading } = useGetInvoice({ id, includes: "documents" });

  if (loading || !invoice || !isIncomingInvoice(invoice)) {
    return <div className="h-[200px] animate-pulse rounded-lg border border-neutral-200 bg-neutral-100" />;
  }

  return (
    <PaymentInformation
      paymentMethod={invoice.paymentMethod.title}
      transactionDate={invoice.createdAt.setLocale("id").toFormat("dd LLL yyyy, HH:mm")}
      client={invoice.receiver.name}
      bankName={invoice.bankAccount.bankName}
      accountNumber={invoice.bankAccount.accountNumber}
      accountHolder={invoice.bankAccount.accountHolderName}
    />
  );
}
