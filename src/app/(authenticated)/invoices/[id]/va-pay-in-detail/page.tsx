"use client";

import React, { useState } from "react";
import { PageHeading } from "@/core/presentations/components/page-heading";
import { PageContent } from "@/core/presentations/components/page-content";
import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import { RemainingPaymentTime } from "./_components/remaining-payment-time";
import { DateTime } from "luxon";

export default function VirtualAccountPayInDetailPage() {
  const paymentData = {
    expirationTime: DateTime.now().plus({ hour: 24 }),
    bankLogo: "/images/bank-logo.png", // Path logo bank
    vaNumber: "12345678901234",
    amount: 1500000,
    receiverName: "PT. Example Company",
    accountHolderName: "John Doe",
    receiverBank: "Bank XYZ",
    receiverAccountNumber: "9876543210",
    fee: 2500
  };

  const [copied, setCopied] = useState(false);
  const totalPayment = paymentData.amount + paymentData.fee;
  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(paymentData.vaNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center mb-6">
                {/* Bank Logo Placeholder */}
                <div className="h-12 w-16 bg-gray-100 rounded flex items-center justify-center mr-4">
                  <span className="text-xs text-gray-500">LOGO</span>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Virtual Account</p>
                  <p className="text-lg font-semibold">Bank XYZ</p>
                </div>
              </div>

              {/* VA Number with Copy button */}
              <div className="flex items-center mb-6">
                <div
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                  <span className="font-mono text-lg font-bold">{paymentData.vaNumber}</span>
                  <button
                    onClick={copyToClipboard}
                    className="text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <ClipboardDocumentIcon className="h-5 w-5 mr-1" />
                    <span className="text-sm">{copied ? "Tersalin!" : "Salin"}</span>
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Pembayaran</p>
                <p className="text-2xl font-bold">{formatRupiah(totalPayment)}</p>
                <p className="text-sm text-gray-500 mt-2">Mohon lakukan pembayaran sesuai dengan jumlah yang
                  tertera.</p>
                <p className="text-sm text-gray-500 mt-2">
                  Bingung cara bayarnya gimana? <a href="https://loonas.id" target="_blank" rel="noopener noreferrer"
                                                   className="text-blue-600">Ikuti petunjuk disini</a>
                </p>
              </div>

            </div>
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