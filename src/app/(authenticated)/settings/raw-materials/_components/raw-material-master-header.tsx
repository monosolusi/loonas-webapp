"use client";

import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { useRawMaterialMaster } from "@/app/(authenticated)/settings/raw-materials/_providers/raw-material-master-provider";

export function RawMaterialMasterHeader() {
  const { meta } = useRawMaterialMaster();

  return (
    <DetailPageHeader
      backHref="/settings"
      title="Bahan Baku"
      subtitle={meta ? `${meta.total} bahan baku` : "Memuat..."}
    />
  );
}
