"use client";

import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { useCoaMappings } from "@/app/(authenticated)/settings/chart-of-accounts/mappings/_providers/coa-mappings-provider";

export function CoaMappingsHeader() {
  const { meta } = useCoaMappings();

  return (
    <DetailPageHeader
      backHref="/settings"
      title="Pemetaan Akun"
      subtitle={meta ? `${meta.total} pemetaan akun` : "Memuat..."}
    />
  );
}
