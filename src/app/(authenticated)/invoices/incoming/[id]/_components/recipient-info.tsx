"use client";

import Image from "next/image";

interface RecipientInfoProps {
  name: string;
  email: string;
  phoneNumber: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
}

export function RecipientInfo({ name, email, phoneNumber, bankName, accountHolderName, accountNumber }: RecipientInfoProps) {
  const handleCopyAccountNumber = () => {
    navigator.clipboard.writeText(accountNumber);
  };

  return (
    <div className="flex flex-col gap-y-5">
      {/* Contact Info */}
      <div className="flex flex-col gap-y-1">
        <span className="text-sm leading-5 font-semibold">{name}</span>
        <div className="flex flex-col gap-y-1.5 text-xs leading-4 text-neutral-200">
          <span>{email}</span>
          <span>{phoneNumber}</span>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-neutral-100" />

      {/* Bank Details */}
      <div className="flex flex-col gap-y-3">
        <div className="flex flex-col gap-y-0.5">
          <span className="text-xs leading-4 text-neutral-200">Bank</span>
          <span className="text-sm leading-5 font-semibold">{bankName}</span>
        </div>
        <div className="flex flex-col gap-y-0.5">
          <span className="text-xs leading-4 text-neutral-200">Atas Nama</span>
          <span className="text-sm leading-5 font-semibold">{accountHolderName}</span>
        </div>
        <div className="flex flex-col gap-y-0.5">
          <span className="text-xs leading-4 text-neutral-200">Nomor Rekening</span>
          <div className="flex items-center justify-between rounded-lg border border-neutral-100 px-3 py-2.5">
            <span className="text-sm font-semibold text-neutral-500">{accountNumber}</span>
            <button type="button" onClick={handleCopyAccountNumber} className="cursor-pointer">
              <Image
                src="/assets/images/copy-icon-neutral-200-w12-h12.svg"
                alt="copy-icon"
                width={16}
                height={16}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
