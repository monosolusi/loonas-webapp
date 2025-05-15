"use client";

import React, { useEffect } from "react";
import { PageContent } from "@/core/presentations/components/page-content";
import { Actions } from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/actions";
import {
  PaymentInstruction
} from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/payment-instruction";
import {
  CurrentStatusImpl
} from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/current-status-impl";
import { TimelineImpl } from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/timeline-impl";
import { PaymentRequestStatus } from "@/features/payment/domain/enums/payment-request";
import { useRouter } from "next/navigation";


export default function DisbursementStatusPage() {
  return (
    <DisbursementStatusPageImpl />
  );
}

function DisbursementStatusPageImpl() {
  const router = useRouter();
  const currentStatus = PaymentRequestStatus.PENDING_PAYMENT;
  const acceptedStatus = [
    PaymentRequestStatus.PENDING_PAYMENT,
    PaymentRequestStatus.PAYMENT_RECEIVED_PENDING_DELIVERY,
    PaymentRequestStatus.COMPLETED,
    PaymentRequestStatus.CANCELLED,
    PaymentRequestStatus.FAILED
  ];

  useEffect(() => {
    if (acceptedStatus.includes(currentStatus)) return;
    router.back();
  }, [currentStatus]);

  return (
    <PageContent>
      <div className="max-w-md mx-auto">
        <div className="mb-6">
          <CurrentStatusImpl />
        </div>
        <PaymentInstruction />
        <div className="mb-6">
          <TimelineImpl />
        </div>
        <Actions />
      </div>
    </PageContent>
  );
}