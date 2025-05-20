"use client";

import React, { useEffect, useState } from "react";
import { PageContent } from "@/core/presentations/components/page-content";
import { PageHeading } from "@/core/presentations/components/page-heading";
import { PaymentDetail } from "@/app/(authenticated)/invoices/[id]/_components/payment-detail";
import { usePaymentRequest } from "@/features/payment/presentations/providers/payment-request";

interface PaymentData {
  receiverName: string;
  receiverBank: string;
  receiverAccountNumber: string;
  accountHolderName: string;
  amount: number;
  fee: number;
}

export function EnterCardDetailContent() {
  const [paymentData, setPaymentData] = useState<PaymentData>();
  const { paymentRequest } = usePaymentRequest();

  useEffect(() => {
    if (!paymentRequest) return;

    setPaymentData({
      amount: paymentRequest.total,
      receiverName: paymentRequest.receiver.name,
      accountHolderName: paymentRequest.bankAccount.accountHolderName,
      receiverBank: paymentRequest.bankAccount.bankName,
      receiverAccountNumber: paymentRequest.bankAccount.accountNumber,
      fee: paymentRequest.totalFee
    });

  }, [paymentRequest]);

  if (!paymentData) return <>Loading...</>;
  return (
    <>
      <PageHeading>Harap Lakukan Pembayaran</PageHeading>
      <PageContent>
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-7/12 space-y-6">
            <div className="w-full">
              <iframe
                src="https://sandbox.doku.com/wt-frontend-transaction/dynamic-payment-page?signature=HMACSHA256%3Dtnw5hf0aoeRDNKZz%2Fr8O5DZo29KDxCirHLrDS7Hd5lI%3D&clientId=BRN-0271-1747612485660&invoiceNumber=a13adc71-c16c-479b-991d-28dc5a891854&requestId=b66ea518-432a-4c13-81ea-10f645a140e5&backgroundColor=fcfcfc&fontColor=171717&buttonBackgroundColor=0050ac&buttonFontColor=f5f5f5&transactionType=S"
                className="w-full min-h-[400px]"
                allowFullScreen
              />
            </div>
          </div>
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
      </PageContent>
    </>
  );
}
