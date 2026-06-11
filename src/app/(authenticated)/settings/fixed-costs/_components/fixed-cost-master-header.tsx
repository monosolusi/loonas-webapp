"use client";

import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { useFixedCostMaster } from "@/app/(authenticated)/settings/fixed-costs/_providers/fixed-cost-master-provider";

export function FixedCostMasterHeader() {
  const { meta } = useFixedCostMaster();

  return (
    <DetailPageHeader
      backHref="/settings"
      title="Biaya Tetap"
      subtitle={meta ? `${meta.total} biaya tetap` : "Memuat..."}
    />
  );
}
