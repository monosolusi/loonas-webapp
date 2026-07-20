"use client";

import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { useJournalDetail } from "@/app/(authenticated)/accounting/journals/[id]/_providers/journal-detail-provider";
import { JournalReverseForm } from "@/app/(authenticated)/accounting/journals/[id]/_components/journal-reverse-form";
import { JournalReverseAckView } from "@/app/(authenticated)/accounting/journals/[id]/_components/journal-reverse-ack-view";

export function JournalReverseDialog() {
  const { reverseDialogOpen, isReversing, pendingWarnings, closeReverseDialog } = useJournalDetail();

  const isAckMode = pendingWarnings.length > 0;

  const handleClose = () => {
    if (isReversing) return;
    closeReverseDialog();
  };

  return (
    <LoonasDialog
      open={reverseDialogOpen}
      onClose={handleClose}
      title={isAckMode ? "Perhatian Sebelum Membalik" : "Balik Jurnal"}
      width="sm"
      allowDismiss={!isReversing}
    >
      <div className="mt-4 flex flex-col gap-y-4">
        {isAckMode ? <JournalReverseAckView /> : <JournalReverseForm />}
      </div>
    </LoonasDialog>
  );
}
