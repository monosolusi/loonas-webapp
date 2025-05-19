"use client";

import {FilledButton} from "@/core/presentations/components/filled-button";
import React, {useState} from "react";
import {useCreateIncomingInvoice} from "@/features/invoice/presentations/providers/create-incoming-invoice";
import {useCreateIncomingInvoiceSteps} from "@/features/invoice/presentations/providers/create-incoming-invoice-steps";
import {useRouter} from "next/navigation";
import {ErrorCodes, ServerError} from "@/core/resources/server-error";

export function PayNowButton() {
  const {paymentGateway, paymentScheme, createPaymentRequest} = useCreateIncomingInvoice();
  const {nextStep} = useCreateIncomingInvoiceSteps();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePayClick = async () => {
    try {
      setLoading(true);
      if (!createPaymentRequest) throw new ServerError(ErrorCodes.NOT_IMPLEMENTED);
      const paymentRequest = await createPaymentRequest();

      // Assuming it is a success,
      // we will navigate to /invoices/:payment_request_id/va-pay-in-detail for VA and /invoices/:payment_request_id/qris-pay-in-detail for QRIS
      // For CC payment method, we haven't thought about it.
      // Maybe we can go to /invoices/:payment_request_id/cc-pay-in-detail
      if (paymentRequest.paymentMethod.title.toLowerCase() === "virtual account") {
        router.replace(`/invoices/${paymentRequest.id}/va-pay-in-detail`);
      } else if (paymentRequest.paymentMethod.title.toLowerCase() === "qris") {
        router.replace(`/invoices/${paymentRequest.id}/qris-pay-in-detail`);
      } else if (paymentRequest.paymentMethod.title.toLowerCase() === "credit card") {
        router.replace(`/invoices/${paymentRequest.id}/cc-enter-card-detail`);
      } else throw new ServerError(ErrorCodes.NOT_IMPLEMENTED);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <FilledButton
      disabled={!paymentGateway || (paymentGateway.requiresSchemeSelection && !paymentScheme)}
      type="button"
      onClick={handlePayClick}
      className="w-full"
      loading={loading}
    >
      Bayar Sekarang
    </FilledButton>
  );
}
