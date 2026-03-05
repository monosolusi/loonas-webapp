"use client";

import { PageContent } from "@/core/presentations/components/page-content";
import { TextHeadingWithUnderline } from "@/core/presentations/components/text-heading-with-underline";
import { RemainingPaymentTime } from "@/core/presentations/components/remaining-payment-time";
import { VirtualAccountDetailBox } from "@/core/presentations/components/va-detail";
import { PaymentDetail } from "@/app/(authenticated)/invoices/_components/payment-detail";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useGetIncomingInvoice } from "@/features/invoice/presentations/hooks/use-get-incoming-invoice";
import { useGetVirtualAccountPayInDetail } from "@/features/payment/presentations/hooks/use-get-virtual-account-pay-in-detail";
import { isIncomingInvoice } from "@/features/invoice/domain/guards/invoice-guards";

export default function VirtualAccountPayInDetailPage() {
  // Invoice ID. However, we always assume it is a PaymentRequest ID.
  // Just because someone who accesses this page always coming from PaymentRequest. No possibility of OutgoingInvoice ID.
  const { id } = useParams<{ id: string }>();
  const { invoice, loading: invoiceLoading } = useGetIncomingInvoice({ id });
  const { payIn, loading: payInLoading } = useGetVirtualAccountPayInDetail({ requestId: id });

  const paymentData = useMemo(() => {
    if (payInLoading || invoiceLoading) return null;
    if (!payIn) return null;
    if (!invoice) return null;
    if (!isIncomingInvoice(invoice)) return null;

    return {
      deadline: payIn.expirationTime,
      virtualAccount: {
        bank: {
          logoUrl: payIn.paymentScheme.logoUrl,
          name: payIn.paymentScheme.name,
        },
        accountNumber: payIn.accountNumber,
        amount: payIn.amount,
      },
      invoice: {
        id: invoice.id,
        fundRecipient: {
          name: invoice.receiver.name,
          bank: {
            name: invoice.bankAccount.bankName,
            accountNumber: invoice.bankAccount.accountNumber,
            accountHolderName: invoice.bankAccount.accountHolderName,
          },
        },
        summary: {
          total: invoice.amount,
          fee: invoice.fee,
          totalToBePaid: invoice.total,
        },
      },
    };
  }, [payIn, invoice, invoiceLoading, payInLoading]);

  if (!paymentData) return null;
  return (
    <PageContent>
      <div className="flex flex-col space-y-4">
        <TextHeadingWithUnderline className="mb-8">Harap Lakukan Pembayaran</TextHeadingWithUnderline>
        <div className="flex flex-row space-x-4">
          <div className="flex flex-1 flex-col space-y-4">
            <RemainingPaymentTime deadline={paymentData.deadline} />
            <VirtualAccountDetailBox
              logoUrl={paymentData.virtualAccount.bank.logoUrl}
              bankName={paymentData.virtualAccount.bank.name}
              accountNumber={paymentData.virtualAccount.accountNumber}
              totalPayment={paymentData.virtualAccount.amount}
            />
          </div>
          <div className="flex flex-1">
            <PaymentDetail
              invoiceId={paymentData.invoice.id}
              receiverName={paymentData.invoice.fundRecipient.name}
              bankName={paymentData.invoice.fundRecipient.bank.name}
              accountNumber={paymentData.invoice.fundRecipient.bank.accountNumber}
              accountHolderName={paymentData.invoice.fundRecipient.bank.accountHolderName}
              total={paymentData.invoice.summary.total}
              fee={paymentData.invoice.summary.fee}
              totalPayment={paymentData.invoice.summary.totalToBePaid}
              showActions={false}
            />
          </div>
        </div>
      </div>
    </PageContent>
  );
}
