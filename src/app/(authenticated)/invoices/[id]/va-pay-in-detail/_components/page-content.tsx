"use client";

import { DateTime } from "luxon";
import { PageHeading } from "@/core/presentations/components/page-heading";
import { RemainingPaymentTime } from "@/app/(authenticated)/invoices/[id]/va-pay-in-detail/_components/remaining-payment-time";
import { VirtualAccountDetailBox } from "@/app/(authenticated)/invoices/[id]/va-pay-in-detail/_components/va-detail";
import { PaymentDetail } from "@/app/(authenticated)/invoices/_components/payment-detail";
import React, { useEffect, useState } from "react";
import { PageContent } from "@/core/presentations/components/page-content";
import { useVirtualAccountPayInDetail } from "@/features/payment/presentations/providers/virtual-account-pay-in-detail";
import { usePaymentRequest } from "@/features/payment/presentations/providers/payment-request";

interface PaymentData {
  expirationTime: DateTime;
  bankLogo: string;
  vaNumber: string;
  vaBankName: string;
  amount: number;
  receiverName: string;
  accountHolderName: string;
  receiverBank: string;
  receiverAccountNumber: string;
  fee: number;
}

export function VirtualAccountPayInDetailPageContent(props: { invoiceId: string }) {
  const [paymentData, setPaymentData] = useState<PaymentData>();
  const { vaDetail } = useVirtualAccountPayInDetail();
  const { paymentRequest } = usePaymentRequest();

  useEffect(() => {
    if (!vaDetail || !paymentRequest) return;
    if (!paymentRequest.paymentScheme) return;

    setPaymentData({
      expirationTime: vaDetail.expirationTime,
      bankLogo: paymentRequest.paymentScheme.logoUrl,
      vaNumber: vaDetail.accountNumber,
      vaBankName: vaDetail.paymentScheme.name,
      amount: paymentRequest.total,
      receiverName: paymentRequest.receiver.name,
      accountHolderName: paymentRequest.bankAccount.accountHolderName,
      receiverBank: paymentRequest.bankAccount.bankName,
      receiverAccountNumber: paymentRequest.bankAccount.accountNumber,
      fee: paymentRequest.totalFee,
    });
  }, [vaDetail, paymentRequest]);

  if (!paymentData) return <>Loading...</>;
  return (
    <>
      <PageHeading>Harap Lakukan Pembayaran</PageHeading>
      <PageContent>
        <div className="flex flex-col gap-6 lg:flex-row">
          {/* Left side - Countdown, VA, and Amount */}
          <div className="w-full space-y-6 lg:w-7/12">
            {/* Countdown Timer */}
            <RemainingPaymentTime deadline={paymentData.expirationTime} />

            {/* Virtual Account Box */}
            <VirtualAccountDetailBox
              logoUrl={paymentData.bankLogo}
              bankName={paymentData.vaBankName}
              accountNumber={paymentData.vaNumber}
              totalPayment={paymentData.amount + paymentData.fee}
            />
          </div>

          {/* Right side - Payment Details */}
          <PaymentDetail
            invoiceId={props.invoiceId}
            receiverName={paymentData.receiverName}
            bankName={paymentData.receiverBank}
            accountNumber={paymentData.receiverAccountNumber}
            accountHolderName={paymentData.accountHolderName}
            total={paymentData.amount}
            fee={paymentData.fee}
            totalPayment={paymentData.amount + paymentData.fee}
          />
        </div>
      </PageContent>
    </>
  );
}
