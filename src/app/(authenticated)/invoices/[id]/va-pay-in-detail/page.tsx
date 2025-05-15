import React from "react";
import { VirtualAccountPayInDetailPageContent } from "./_components/page-content";
import { PaymentRequestProvider } from "@/features/payment/presentations/providers/payment-request";
import {
  VirtualAccountPayInDetailProvider
} from "@/features/payment/presentations/providers/virtual-account-pay-in-detail";

export default async function VirtualAccountPayInDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <PaymentRequestProvider requestId={id} includes="receiver,receiver_bank_account">
      <VirtualAccountPayInDetailProvider requestId={id}>
        <VirtualAccountPayInDetailPageContent invoiceId={id} />
      </VirtualAccountPayInDetailProvider>
    </PaymentRequestProvider>
  );
}