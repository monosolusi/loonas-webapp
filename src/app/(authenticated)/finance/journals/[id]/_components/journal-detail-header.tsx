"use client";

import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { useJournalDetail } from "@/app/(authenticated)/finance/journals/[id]/_providers/journal-detail-provider";
import { JournalReverseButton } from "@/app/(authenticated)/finance/journals/[id]/_components/journal-reverse-button";

export function JournalDetailHeader() {
  const { journal } = useJournalDetail();

  return (
    <DetailPageHeader
      title="Detail Jurnal"
      subtitle={journal.displayDate}
      backHref="/finance/journals"
      action={<JournalReverseButton />}
    />
  );
}
