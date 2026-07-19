"use client";

import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { TaxPostureProvider } from "@/app/(authenticated)/accounting/tax-posture/_providers/tax-posture-provider";
import { TaxPostureLoading } from "@/app/(authenticated)/accounting/tax-posture/_components/tax-posture-loading";
import { TaxPostureAccessDenied } from "@/app/(authenticated)/accounting/tax-posture/_components/tax-posture-access-denied";
import { TaxPostureFormCard } from "@/app/(authenticated)/accounting/tax-posture/_components/tax-posture-form-card";
import { TaxPostureHistoryCard } from "@/app/(authenticated)/accounting/tax-posture/_components/tax-posture-history-card";

export default function TaxPosturePage() {
  return (
    <TaxPostureProvider loading={<TaxPostureLoading />} accessDenied={<TaxPostureAccessDenied />}>
      <div className="flex flex-col gap-y-6">
        <DetailPageHeader hideBack title="Postur Pajak" />
        <TaxPostureFormCard />
        <TaxPostureHistoryCard />
      </div>
    </TaxPostureProvider>
  );
}
