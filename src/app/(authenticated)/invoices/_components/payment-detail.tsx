"use client";

import React from "react";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface PaymentDetailProps {
  receiverName: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  total: number;
  fee: number;
  totalPayment: number;
}

export function PaymentDetail(props: PaymentDetailProps) {
  return (
    <div className="flex w-full flex-col">
      <div className="rounded-lg border border-neutral-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Rincian Pembayaran</h3>

        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-sm text-neutral-400">Nama Penerima</span>
            <span className="font-bold">{props.receiverName}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-neutral-400">Bank Penerima</span>
            <span className="font-bold">{props.bankName}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-neutral-400">Nomor Rekening Penerima</span>
            <span className="font-bold">{props.accountNumber}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-sm text-neutral-400">Nama Pemilik Rekening</span>
            <span className="font-bold">{props.accountHolderName}</span>
          </div>

          <div className="my-2 border-t border-neutral-200 pt-2"></div>

          <div className="flex items-center justify-between">
            <span className="items-center text-neutral-300">
              <span className="group relative inline-flex items-center">
                Dana Diteruskan <InformationCircleIcon className="ml-1 h-4 w-4 cursor-help text-neutral-300" />
                <span className="invisible absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-md bg-neutral-700 px-3 py-1 text-xs whitespace-nowrap text-neutral-50 group-hover:visible">
                  Dana yang akan diteruskan ke rekening tujuan
                </span>
              </span>
            </span>
            <span className="font-medium">{IDRFormatter.toCurrency(props.total)}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-neutral-300">Biaya Layanan</span>
            <span className="font-medium">{IDRFormatter.toCurrency(props.fee)}</span>
          </div>

          <div className="my-2 border-t border-neutral-200 pt-2"></div>

          <div className="flex items-center justify-between">
            <span className="items-center text-neutral-300">
              <span className="group relative inline-flex items-center">
                Bayar <InformationCircleIcon className="ml-1 h-4 w-4 cursor-help text-neutral-300" />
                <span className="invisible absolute bottom-full left-1/2 mb-2 -translate-x-1/2 rounded-md bg-neutral-700 px-3 py-1 text-xs whitespace-nowrap text-neutral-50 group-hover:visible">
                  Total yang harus kamu bayar, sudah termasuk biaya tambahan
                </span>
              </span>
            </span>
            <span className="text-lg font-bold">{IDRFormatter.toCurrency(props.totalPayment)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
