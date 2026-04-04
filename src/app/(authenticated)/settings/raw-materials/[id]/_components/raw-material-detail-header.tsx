"use client";

import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { useRawMaterialDetail } from "@/app/(authenticated)/settings/raw-materials/[id]/_providers/raw-material-detail-provider";

export function RawMaterialDetailHeader() {
  const { rawMaterial } = useRawMaterialDetail();

  return <DetailPageHeader title={rawMaterial?.name ?? "Bahan Baku"} backHref="/settings/raw-materials" />;
}
