"use client";

import { useJournalDetail } from "@/app/(authenticated)/finance/journals/[id]/_providers/journal-detail-provider";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";

export function JournalReverseButton() {
  const { journal, handleOpenReverseDialog } = useJournalDetail();

  // Reversal journals cannot themselves be reversed — hide the button entirely
  if (journal.isReversal) return null;

  return (
    <div className="flex flex-col items-end gap-y-1">
      <SecondaryButton
        outlined
        type="button"
        label="Balik Jurnal"
        disabled={journal.isReversedCurrently}
        onClick={handleOpenReverseDialog}
      />
      {journal.isReversedCurrently && (
        <p className="text-xs text-neutral-400">Jurnal ini sudah dibalik.</p>
      )}
    </div>
  );
}
