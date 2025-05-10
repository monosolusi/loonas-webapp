"use client";

import React from "react";
import { PageHeading } from "@/core/presentations/components/page-heading";
import { PageContent } from "@/core/presentations/components/page-content";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { RemainingPaymentTime } from "./_components/remaining-payment-time";
import { DateTime } from "luxon";
import { VirtualAccountDetailBox } from "@/app/(authenticated)/invoices/[id]/va-pay-in-detail/_components/va-detail";

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

  const totalPayment = paymentData.amount + paymentData.fee;

  const formatRupiah = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handlePayLater = () => {
    // Implementasi logika untuk "Bayar Nanti"
    console.log("Bayar nanti diklik");
  };

  const handlePaymentDone = () => {
    // Implementasi logika untuk "Sudah Bayar"
    console.log("Sudah bayar diklik");
  };

  // @ts-ignore
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
          <div className="w-full lg:w-5/12 flex flex-col">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Rincian Pembayaran</h3>

              <div className="space-y-4">
                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm">Nama Penerima</span>
                  <span className="font-bold">{paymentData.receiverName}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm">Bank Penerima</span>
                  <span className="font-bold">{paymentData.receiverBank}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm">Nomor Rekening Penerima</span>
                  <span className="font-bold">{paymentData.receiverAccountNumber}</span>
                </div>

                <div className="flex flex-col">
                  <span className="text-gray-600 text-sm">Nama Pemilik Rekening</span>
                  <span className="font-bold">{paymentData.accountHolderName}</span>
                </div>

                <div className="border-t border-gray-200 my-2 pt-2"></div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Tagihan</span>
                  <span className="font-medium">{formatRupiah(paymentData.amount)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Biaya Layanan</span>
                  <span className="font-medium">{formatRupiah(paymentData.fee)}</span>
                </div>

                <div className="border-t border-gray-200 my-2 pt-2"></div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-semibold">Total Pembayaran</span>
                  <span className="font-bold text-lg">{formatRupiah(totalPayment)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons - Placed directly below the payment details */}
            <div className="mt-4 flex flex-col gap-3">
              <FilledButton onClick={handlePaymentDone}>
                Sudah Bayar
              </FilledButton>
              <OutlinedButton onClick={handlePayLater}>
                Bayar Nanti
              </OutlinedButton>
            </div>
          </div>
        </div>
      </PageContent>
    </>
  );
}