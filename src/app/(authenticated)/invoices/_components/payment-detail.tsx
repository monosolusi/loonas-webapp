"use client";

import React from "react";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { ActionButtons } from "@/app/(authenticated)/invoices/[id]/va-pay-in-detail/_components/action-buttons";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

interface PaymentDetailProps {
  invoiceId?: string;
  receiverName: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  total: number;
  fee: number;
  totalPayment: number;
  showActions?: boolean;
}

export function PaymentDetail(props: PaymentDetailProps) {
  return (
    <div className="w-full flex flex-col">
      <div className="bg-white border border-neutral-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Rincian Pembayaran</h3>

        <div className="space-y-4">
          <div className="flex flex-col">
            <span className="text-neutral-400 text-sm">Nama Penerima</span>
            <span className="font-bold">{props.receiverName}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-neutral-400 text-sm">Bank Penerima</span>
            <span className="font-bold">{props.bankName}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-neutral-400 text-sm">Nomor Rekening Penerima</span>
            <span className="font-bold">{props.accountNumber}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-neutral-400 text-sm">Nama Pemilik Rekening</span>
            <span className="font-bold">{props.accountHolderName}</span>
          </div>

          <div className="border-t border-neutral-200 my-2 pt-2"></div>

          <div className="flex justify-between items-center">
            <span className="text-neutral-300 items-center">
              <span className="group relative inline-flex items-center">
                Dana Diteruskan <InformationCircleIcon className="h-4 w-4 ml-1 text-neutral-300 cursor-help" />
                <span
                  className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 text-xs text-white bg-black rounded-md whitespace-nowrap"
                >
                  Dana yang akan diteruskan ke rekening tujuan
                </span>
              </span>
            </span>
            <span className="font-medium">{IDRFormatter.toCurrency(props.total)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-neutral-300">Biaya Layanan</span>
            <span className="font-medium">{IDRFormatter.toCurrency(props.fee)}</span>
          </div>

          <div className="border-t border-neutral-200 my-2 pt-2"></div>

          <div className="flex justify-between items-center">
            <span className="text-neutral-300 items-center">
              <span className="group relative inline-flex items-center">
                Bayar <InformationCircleIcon className="h-4 w-4 ml-1 text-neutral-300 cursor-help" />
                <span
                  className="invisible group-hover:visible absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1 text-xs text-white bg-black rounded-md whitespace-nowrap"
                >
                  Total yang harus kamu bayar, sudah termasuk biaya tambahan
                </span>
              </span>
            </span>
            <span className="font-bold text-lg">{IDRFormatter.toCurrency(props.totalPayment)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons - Placed directly below the payment details */}
      {(props.showActions === undefined || props.showActions) && props.invoiceId && (
        <ActionButtons invoiceId={props.invoiceId} />
      )}
    </div>
  );
}
