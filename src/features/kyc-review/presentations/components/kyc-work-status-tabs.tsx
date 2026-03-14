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
    <div className="flex flex-row gap-x-1">
      {TABS.map((tab) => {
        const isActive = activeStatus === tab.value;
        return (
          <button
            key={tab.label}
            onClick={() => onChange(tab.value)}
            className={clsx(
              "cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
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
