"use client";

import clsx from "clsx";
import { VerificationWorkStatus } from "@/features/kyc-review/domain/enums/verification-work-status";

interface KycWorkStatusTabsProps {
  activeStatus: VerificationWorkStatus | undefined;
  onChange: (status: VerificationWorkStatus | undefined) => void;
}

const TABS: { label: string; value: VerificationWorkStatus | undefined }[] = [
  { label: "Semua", value: undefined },
  { label: "Menunggu", value: VerificationWorkStatus.IN_QUEUE },
  { label: "Diproses", value: VerificationWorkStatus.PROCESSING },
  { label: "Selesai", value: VerificationWorkStatus.DONE },
  { label: "Ditolak", value: VerificationWorkStatus.FAILED },
];

export function KycWorkStatusTabs({ activeStatus, onChange }: KycWorkStatusTabsProps) {
  return (
    <div className="-mx-4 flex flex-row gap-x-1 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
      {TABS.map((tab) => {
        const isActive = activeStatus === tab.value;
        return (
          <button
            key={tab.label}
            onClick={() => onChange(tab.value)}
            className={clsx(
              "shrink-0 cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
              isActive ? "bg-primary-300 text-white" : "text-neutral-300 hover:bg-neutral-50",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
