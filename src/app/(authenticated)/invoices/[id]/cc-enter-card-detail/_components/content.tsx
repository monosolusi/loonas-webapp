"use client";

import React, { useEffect, useState } from "react";
import { PageContent } from "@/core/presentations/components/page-content";
import { PageHeading } from "@/core/presentations/components/page-heading";
import { PaymentDetail } from "@/app/(authenticated)/invoices/_components/payment-detail";
import { usePaymentRequest } from "@/features/payment/presentations/providers/payment-request";
import { useCreditCardFullRedirectPayInDetail } from "@/features/payment/presentations/providers/cc-full-redirect-pay-in-detail";

interface PaymentData {
  receiverName: string;
  receiverBank: string;
  receiverAccountNumber: string;
  accountHolderName: string;
  amount: number;
  fee: number;
  redirectUrl: string;
}

export function EnterCardDetailContent() {
  const [paymentData, setPaymentData] = useState<PaymentData>();
  const { paymentRequest } = usePaymentRequest();
  const { ccDetail } = useCreditCardFullRedirectPayInDetail();

  useEffect(() => {
    if (!paymentRequest || !ccDetail) return;

    setPaymentData({
      amount: paymentRequest.total,
      receiverName: paymentRequest.receiver.name,
      accountHolderName: paymentRequest.bankAccount.accountHolderName,
      receiverBank: paymentRequest.bankAccount.bankName,
      receiverAccountNumber: paymentRequest.bankAccount.accountNumber,
      fee: paymentRequest.totalFee,
      redirectUrl: ccDetail.redirectUrl,
    });
  }, [paymentRequest]);

  if (!paymentData || !ccDetail) return <>Loading...</>;
  return (
    <>
      <PageHeading>Harap Lakukan Pembayaran</PageHeading>
      <PageContent>
        <div className="flex flex-col gap-6 lg:flex-row">
          <div className="flex-3">
            <div className="w-full space-y-6">
              <div className="w-full">
                <iframe src={paymentData.redirectUrl} className="min-h-[500px] w-full" allowFullScreen />
              </div>
            </div>
          </div>
          <div className="flex-2">
            <PaymentDetail
              receiverName={paymentData.receiverName}
              bankName={paymentData.receiverBank}
              accountNumber={paymentData.receiverAccountNumber}
              accountHolderName={paymentData.accountHolderName}
              total={paymentData.amount}
              fee={paymentData.fee}
              totalPayment={paymentData.amount + paymentData.fee}
              showActions={false}
            />
          </div>
        </div>
      </PageContent>
    </>
  );
}
