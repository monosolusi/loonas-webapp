"use client";

import React from "react";
import { PageHeading } from "@/core/presentations/components/page-heading";
import { PageContent } from "@/core/presentations/components/page-content";
import { RemainingPaymentTime } from "./_components/remaining-payment-time";
import { DateTime } from "luxon";
import { VirtualAccountDetailBox } from "@/app/(authenticated)/invoices/[id]/va-pay-in-detail/_components/va-detail";
import { PaymentDetail } from "@/app/(authenticated)/invoices/[id]/va-pay-in-detail/_components/payment-detail";

export default function VirtualAccountPayInDetailPage() {
  const paymentData = {
    expirationTime: DateTime.now().plus({ hour: 24 }),
    bankLogo: "https://res.cloudinary.com/monosolusi/image/upload/v1745932428/loonas/web-assets/2560px-BRI_2020.svg_lwjmpi.png", // Path logo bank
    vaNumber: "12345678901234",
    amount: 1500000,
    receiverName: "PT. Example Company",
    accountHolderName: "John Doe",
    receiverBank: "Bank XYZ",
    receiverAccountNumber: "9876543210",
    fee: 2500
  };

  return (
    <>
      <PageHeading>Harap Lakukan Pembayaran</PageHeading>
      <PageContent>
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left side - Countdown, VA, and Amount */}
          <div className="w-full lg:w-7/12 space-y-6">
            {/* Countdown Timer */}
            <RemainingPaymentTime deadline={paymentData.expirationTime} />

            {/* Virtual Account Box */}
            <VirtualAccountDetailBox
              logoUrl={paymentData.bankLogo}
              bankName={paymentData.receiverBank}
              accountNumber={paymentData.vaNumber}
              totalPayment={paymentData.amount + paymentData.fee}
            />
          </div>

          {/* Right side - Payment Details */}
          <PaymentDetail
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