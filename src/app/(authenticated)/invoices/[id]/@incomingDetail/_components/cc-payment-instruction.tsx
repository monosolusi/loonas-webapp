"use client";

import { Card } from "@/core/presentations/components/card";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { useGetIncomingInvoice } from "@/features/invoice/presentations/hooks/use-get-incoming-invoice";
import { PaymentRequestStatus } from "@/features/payment/domain/enums/payment-request";
import { useParams, useRouter } from "next/navigation";

export function CreditCardPaymentInstruction() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetIncomingInvoice({ id });

  const handleClick = () => {
    router.push(`/invoices/${id}/cc-enter-card-detail`);
  };

  if (!invoice || loading) return null;
  if (invoice.paymentMethod.title.toLowerCase() !== "credit card") return null;
  if (invoice.status !== PaymentRequestStatus.PENDING_PAYMENT) return null;
  return (
    <Card>
      <div className="flex flex-col">
        <div className="mb-4 text-lg font-semibold">Petunjuk Pembayaran</div>
        <div className="space-y-4">
          <div className="flex flex-col">
            <div className="text-sm text-gray-600">Metode Pembayaran</div>
            <div className="font-bold">Credit Card</div>
          </div>
          <div className="flex-1">
            <FilledButton onClick={handleClick}>Lakukan Pembayaran</FilledButton>
          </div>
        </div>
      </div>
    </Card>
  );
}
