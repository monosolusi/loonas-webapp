"use client";

import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { WarningSeverity } from "@/features/accounting/domain/enums/warning-severity";
import { JournalWarningItem } from "@/features/accounting/presentations/components/journal-warning-item";
import { useJournalCreate } from "@/app/(authenticated)/accounting/journals/new/_providers/journal-create-provider";

export function JournalWarningDialog() {
  const { warningDialogOpen, pendingWarnings, isSubmitting, handleConfirmWarnings, closeWarningDialog } =
    useJournalCreate();

  const hasHard = pendingWarnings.some((w) => w.severity === WarningSeverity.HARD);

  return (
    <LoonasDialog
      open={warningDialogOpen}
      title="Perhatian Sebelum Memposting"
      width="md"
      allowDismiss={!isSubmitting}
      onClose={closeWarningDialog}
    >
      <div className="mt-4 flex flex-col gap-y-4">
        {hasHard && (
          <div className="flex flex-row items-center gap-x-3 rounded-lg bg-error-50 px-4 py-3">
            <ExclamationCircleIcon className="size-4 shrink-0 text-error-400" />
            <span className="text-sm font-medium">Harap perhatikan peringatan di bawah sebelum melanjutkan.</span>
          </div>
        )}

        <div className="flex max-h-80 flex-col gap-y-2 overflow-y-auto">
          {pendingWarnings.map((warning, index) => (
            <JournalWarningItem key={`${warning.code}-${index}`} warning={warning} />
          ))}
        </div>

        <DialogFooter>
          <SecondaryButton
            outlined
            type="button"
            label="Batal"
            autoFocus
            disabled={isSubmitting}
            onClick={closeWarningDialog}
          />
          <PrimaryButton
            label="Tetap Posting"
            loading={isSubmitting}
            onClick={handleConfirmWarnings}
          />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
