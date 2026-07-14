"use client";

import { useState } from "react";
import { VerificationWorkStatus } from "@/features/kyc-review/domain/enums/verification-work-status";
import { KycWorkStatusTabs } from "@/features/kyc-review/presentations/components/kyc-work-status-tabs";
import { KycWorkTableImpl } from "@/features/kyc-review/presentations/components/kyc-work-table-impl";
import { ListPageHeader } from "@/core/presentations/components/list-page-header";

export default function KycListPage() {
  const [activeStatus, setActiveStatus] = useState<VerificationWorkStatus | undefined>(VerificationWorkStatus.IN_QUEUE);

  return (
    <div className="flex flex-col gap-y-6">
      <ListPageHeader title="KYC Review" subtitle="Tinjau pengajuan verifikasi akun pengguna." />

      <KycWorkStatusTabs activeStatus={activeStatus} onChange={setActiveStatus} />
      <KycWorkTableImpl status={activeStatus} />
    </div>
  );
}
