"use client";

import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { JournalCreateSubmitButton } from "@/app/(authenticated)/finance/journals/new/_components/journal-create-submit-button";

export function JournalCreateHeader() {
  return (
    <DetailPageHeader
      title="Jurnal Baru"
      backHref="/finance/journals"
      action={<JournalCreateSubmitButton />}
    />
  );
}
