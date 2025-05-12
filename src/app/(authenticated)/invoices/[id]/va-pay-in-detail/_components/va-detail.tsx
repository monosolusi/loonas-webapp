"use client";

import { ClipboardDocumentIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";

interface VirtualAccountDetailBoxProps {
  logoUrl: string;
  bankName: string;
  accountNumber: string;
  totalPayment: number;
}

export function VirtualAccountDetailBox(props: VirtualAccountDetailBoxProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(props.accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center mb-6">
        {/* Bank Logo Placeholder */}
        <div className="h-12 w-16 rounded flex items-center justify-center mr-4">
          <img src={props.logoUrl} alt={`${props.bankName} logo`} className="max-h-10 max-w-14 object-contain" />
        </div>
        <div>
          <p className="text-sm text-gray-500">Virtual Account</p>
          <p className="text-lg font-semibold">{props.bankName}</p>
        </div>
      </div>

      {/* VA Number with Copy button */}
      <div className="flex items-center mb-6">
        <div
          className="flex-1 bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-center">
          <span className="font-mono text-lg font-bold">{props.accountNumber}</span>
          <button
            onClick={copyToClipboard}
            className="text-primary-default hover:text-primary-800 flex items-center cursor-pointer"
          >
            <ClipboardDocumentIcon className="h-5 w-5 mr-1" />
            <span className="text-sm">{copied ? "Tersalin!" : "Salin"}</span>
          </button>
        </div>
      </div>

      {/* Amount */}
      <div>
        <p className="text-sm text-gray-500 mb-1">Total Pembayaran</p>
        <p className="text-2xl font-bold">{IDRFormatter.toCurrency(props.totalPayment)}</p>
        <p className="text-sm text-gray-500 mt-2">Mohon lakukan pembayaran sesuai dengan jumlah yang tertera.</p>
        <p className="text-sm text-gray-500 mt-2">
          Bingung cara bayarnya gimana? &nbsp;
          <a href="https://loonas.id" target="_blank" rel="noopener noreferrer" className="text-primary-default">
            Ikuti petunjuk disini
          </a>
        </p>
      </div>

    </div>
  );
}