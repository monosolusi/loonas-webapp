"use client";

import { SectionCard } from "@/core/presentations/components/section-card";
import { JournalLineEditor } from "@/features/accounting/presentations/components/journal-line-editor/journal-line-editor";
import { useJournalCreate } from "@/app/(authenticated)/accounting/journals/new/_providers/journal-create-provider";

export function JournalCreateLinesCard() {
  const { lines, isSubmitting, formError, setLines } = useJournalCreate();

  return (
    <SectionCard
      iconSrc="/assets/images/credit-card-icon-primary-300-w16-h16.svg"
      title="Baris Jurnal"
    >
      <JournalLineEditor
        lines={lines}
        onChange={setLines}
        disabled={isSubmitting}
        error={formError ?? undefined}
      />
    </SectionCard>
  );
}
