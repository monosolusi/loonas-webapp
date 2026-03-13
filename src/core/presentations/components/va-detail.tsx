"use client";

import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import React from "react";

import { CurrencyDisplay } from "./currency-display";
import { useCopyToClipboard } from "@/core/presentations/hooks/use-copy-to-clipboard";

interface VirtualAccountDetailBoxProps {
  logoUrl: string;
  bankName: string;
  accountNumber: string;
  totalPayment: number;
}

export function VirtualAccountDetailBox(props: VirtualAccountDetailBoxProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className="rounded-lg border border-neutral-200 bg-white p-6">
      <div className="mb-6 flex items-center">
        {/* Bank Logo Placeholder */}
        <div className="mr-4 flex h-12 w-16 items-center justify-center rounded">
          <img src={props.logoUrl} alt={`${props.bankName} logo`} className="max-h-10 max-w-14 object-contain" />
        </div>
        <div>
          <p className="text-sm text-neutral-300">Virtual Account</p>
          <p className="text-lg font-semibold">{props.bankName}</p>
        </div>
      </div>

      {/* VA Number with Copy button */}
      <div className="mb-6 flex items-center">
        <div className="flex flex-1 items-center justify-between rounded-lg border border-neutral-200 bg-neutral-100 p-4">
          <span className="font-mono text-lg font-bold">{props.accountNumber}</span>
          <button
            onClick={() => copy(props.accountNumber)}
            className="text-primary-default hover:text-primary-800 flex cursor-pointer items-center"
          >
            <ClipboardDocumentIcon className="mr-1 h-5 w-5" />
            <span className="text-sm">{copied ? "Tersalin!" : "Salin"}</span>
          </button>
        </div>
      </div>

      {/* Amount */}
      <div>
        <p className="mb-1 text-sm text-neutral-300">Total Pembayaran</p>
        <p className="text-2xl font-bold">
          <CurrencyDisplay value={props.totalPayment} />
        </p>
        <p className="mt-2 text-sm text-neutral-300">Mohon lakukan pembayaran sesuai dengan jumlah yang tertera.</p>
        <p className="mt-2 text-sm text-neutral-300">
          Bingung cara bayarnya gimana? &nbsp;
          <a href="https://loonas.id" target="_blank" rel="noopener noreferrer" className="text-primary-default">
            Ikuti petunjuk disini
          </a>
        </p>
      </div>
    </div>
  );
}
