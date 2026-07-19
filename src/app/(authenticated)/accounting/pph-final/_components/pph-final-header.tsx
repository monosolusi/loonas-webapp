"use client";

import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { PphFinalSubmitButton } from "@/app/(authenticated)/accounting/pph-final/_components/pph-final-submit-button";

export function PphFinalHeader() {
  return (
    <DetailPageHeader title="PPh Final UMKM" hideBack action={<PphFinalSubmitButton />} />
  );
}
