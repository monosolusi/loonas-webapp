import React from "react";
import { PaymentRequestProvider } from "@/features/payment/presentations/providers/payment-request";
import {
  DisbursementStatusPageImpl
} from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/page-impl";


export default async function DisbursementStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <PaymentRequestProvider requestId={id}>
      <DisbursementStatusPageImpl />
    </PaymentRequestProvider>
  );
}