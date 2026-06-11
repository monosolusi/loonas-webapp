"use client";

import { useState } from "react";
import { VerificationWorkStatus } from "@/features/kyc-review/domain/enums/verification-work-status";
import { KycWorkStatusTabs } from "@/features/kyc-review/presentations/components/kyc-work-status-tabs";
import { KycWorkTableImpl } from "@/features/kyc-review/presentations/components/kyc-work-table-impl";

export default function KycListPage() {
  const [activeStatus, setActiveStatus] = useState<VerificationWorkStatus | undefined>(VerificationWorkStatus.IN_QUEUE);

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-1">
        <span className="text-2xl leading-8 font-bold tracking-tight">KYC Review</span>
        <span className="text-sm leading-5 text-neutral-300">Tinjau pengajuan verifikasi akun pengguna.</span>
      </div>

      <KycWorkStatusTabs activeStatus={activeStatus} onChange={setActiveStatus} />
      <KycWorkTableImpl status={activeStatus} />
    </div>
  );
}
