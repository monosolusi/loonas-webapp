"use client";

import React, { useEffect } from "react";
import LoadingAnimation from "../_static-files/loading-animation.json";
import { usePaymentRequest } from "@/features/payment/presentations/providers/payment-request";
import { useRouter } from "next/navigation";
import { PaymentRequestStatus } from "@/features/payment/domain/enums/payment-request";
import { PageContent } from "@/core/presentations/components/page-content";
import { Player } from "@lottiefiles/react-lottie-player";
import {
  CurrentStatusImpl
} from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/current-status-impl";
import {
  PaymentInstruction
} from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/payment-instruction";
import { TimelineImpl } from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/timeline-impl";
import { Actions } from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/actions";

export function DisbursementStatusPageImpl() {
  const { paymentRequest } = usePaymentRequest();

  const router = useRouter();
  const acceptedStatus = [
    PaymentRequestStatus.PENDING_PAYMENT,
    PaymentRequestStatus.PAYMENT_RECEIVED_PENDING_DELIVERY,
    PaymentRequestStatus.COMPLETED,
    PaymentRequestStatus.CANCELLED,
    PaymentRequestStatus.FAILED
  ];

  useEffect(() => {
    if (!paymentRequest) return;
    if (acceptedStatus.includes(paymentRequest.status)) return;
    router.back();
  }, [paymentRequest]);


  if (!paymentRequest) {
    return (
      <PageContent>
        <div className="flex justify-center items-center">
          <div className="w-36 h-36">
            <Player autoplay loop src={LoadingAnimation} />
          </div>
        </div>
      </PageContent>
    );
  } else {
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
}