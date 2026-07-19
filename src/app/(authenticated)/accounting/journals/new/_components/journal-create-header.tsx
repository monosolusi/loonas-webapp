"use client";

import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { JournalCreateSubmitButton } from "@/app/(authenticated)/accounting/journals/new/_components/journal-create-submit-button";

export function JournalCreateHeader() {
  return (
    <DetailPageHeader
      title="Jurnal Baru"
      backHref="/accounting/journals"
      action={<JournalCreateSubmitButton />}
    />
  );
}
