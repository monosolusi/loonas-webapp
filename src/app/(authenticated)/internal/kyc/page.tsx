"use client";

import { KycWorkTableImpl } from "@/features/kyc-review/presentations/components/kyc-work-table-impl";
import { ListPageHeader } from "@/core/presentations/components/list-page-header";

export default function KycListPage() {
  return (
    <div className="flex flex-col gap-y-6">
      <ListPageHeader title="KYC Review" subtitle="Tinjau pengajuan verifikasi akun pengguna." />

      <KycWorkTableImpl />
    </div>
  );
}
