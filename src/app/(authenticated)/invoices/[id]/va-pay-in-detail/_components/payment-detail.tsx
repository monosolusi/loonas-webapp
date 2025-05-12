import { FilledButton } from "@/core/presentations/components/filled-button";
import { OutlinedButton } from "@/core/presentations/components/outlined-button";
import React from "react";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";

interface PaymentDetailProps {
  receiverName: string,
  bankName: string,
  accountNumber: string,
  accountHolderName: string,
  total: number,
  fee: number,
  totalPayment: number
}

export function PaymentDetail(props: PaymentDetailProps) {
  const handlePayLater = () => {
    console.log("Bayar nanti diklik");
  };

  const handlePaymentDone = () => {
    console.log("Sudah bayar diklik");
  };

  return (
    <div className="w-full lg:w-5/12 flex flex-col">
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Rincian Pembayaran</h3>

        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-gray-600 text-sm">Nama Penerima</span>
            <span className="font-bold">{props.receiverName}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-600 text-sm">Bank Penerima</span>
            <span className="font-bold">{props.bankName}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-600 text-sm">Nomor Rekening Penerima</span>
            <span className="font-bold">{props.accountNumber}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-gray-600 text-sm">Nama Pemilik Rekening</span>
            <span className="font-bold">{props.accountHolderName}</span>
          </div>

          <div className="border-t border-gray-200 my-2 pt-2"></div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Tagihan</span>
            <span className="font-medium">{IDRFormatter.toCurrency(props.total)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600">Biaya Layanan</span>
            <span className="font-medium">{IDRFormatter.toCurrency(props.fee)}</span>
          </div>

          <div className="border-t border-gray-200 my-2 pt-2"></div>

          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-semibold">Total Pembayaran</span>
            <span className="font-bold text-lg">{IDRFormatter.toCurrency(props.totalPayment)}</span>
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
  );
}