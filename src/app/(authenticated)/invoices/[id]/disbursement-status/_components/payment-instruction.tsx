import { Card } from "@/core/presentations/components/card";
import Link from "next/link";
import React from "react";
import { usePaymentRequest } from "@/features/payment/presentations/providers/payment-request";
import { PaymentRequestStatus } from "@/features/payment/domain/enums/payment-request";

export function PaymentInstruction() {
  const { paymentRequest } = usePaymentRequest();

  if (!paymentRequest) return null;
  if (paymentRequest.status !== PaymentRequestStatus.PENDING_PAYMENT) return null;
  return (
    <div className="mb-6">
      <Card>
        <div className="flex justify-between items-center">
          <span className="text-black">Petunjuk Pembayaran</span>
          <Link
            className="text-primary-default hover:text-primary-600"
            href="/invoices/1234/va-pay-in-detail"
          >
            Lihat Disini
          </Link>
        </div>
      </Card>
    </div>
  );
}