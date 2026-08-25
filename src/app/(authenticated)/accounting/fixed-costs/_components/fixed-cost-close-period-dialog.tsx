"use client";

import { useState } from "react";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { useFixedCostEntries } from "@/app/(authenticated)/accounting/fixed-costs/_providers/fixed-cost-entries-provider";
import { ClosePeriodBlockNotice } from "@/features/accounting/presentations/components/close-period-block-notice";
import { MANAGERIAL_COSTING_FEATURE } from "@/features/accounting/presentations/constants/feature-flags";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";

export function FixedCostClosePeriodDialog() {
  const {
    matchedPeriod,
    isCloseDialogOpen,
    dismissCloseDialog,
    closePeriodError,
    closePeriodFailureCount,
    isClosing,
    handleClosePeriod,
    isRetryingFailedPostings,
    retryFailedPostingsOutcome,
    retryFailedPostingsErrorMessage,
    handleRetryFailedPostings,
  } = useFixedCostEntries();
  const { account } = useGetCurrentAccount();
  const canRetryFailedPostings = account?.hasFeature(MANAGERIAL_COSTING_FEATURE) ?? false;

  const [reason, setReason] = useState("");

  const isReasonEmpty = reason.trim().length === 0;

  const handleClose = () => {
    if (isClosing) return;
    setReason("");
    dismissCloseDialog();
  };

  const handleSubmit = async () => {
    if (isReasonEmpty || isClosing) return;
    const ok = await handleClosePeriod(reason.trim());
    if (ok) setReason("");
  };

  return (
    <LoonasDialog
      open={isCloseDialogOpen}
      onClose={handleClose}
      title="Tutup Periode"
      width="sm"
      allowDismiss={!isClosing}
    >
      <div className="mt-4 flex flex-col gap-y-4">
        {matchedPeriod && (
          <p className="text-sm text-neutral-500">
            Anda akan mengunci periode <span className="font-semibold">{matchedPeriod.label}</span>. Setelah dikunci,
            data biaya tetap pada periode ini tidak dapat diubah.
          </p>
        )}

        <div className="flex flex-col gap-y-1.5">
          <label htmlFor="close-fixed-cost-reason" className="text-sm font-medium text-neutral-500">
            Alasan penutupan <span className="text-error-300">*</span>
          </label>
          <textarea
            id="close-fixed-cost-reason"
            autoFocus
            rows={3}
            maxLength={500}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Tuliskan alasan penutupan periode..."
            className="w-full resize-none rounded-lg border border-neutral-100 px-3 py-2 text-sm text-neutral-500 placeholder:text-neutral-200 focus:border-primary-300 focus:outline-none"
          />
        </div>

        <div role="status" aria-live="polite" aria-atomic="false">
          {closePeriodError && (
            <div key={closePeriodFailureCount} className="rounded-lg border border-warning-400 bg-warning-50 px-4 py-3">
              <ClosePeriodBlockNotice
                block={closePeriodError}
                failureCount={closePeriodFailureCount}
                canRetry={canRetryFailedPostings}
                isRetrying={isRetryingFailedPostings}
                retryErrorMessage={retryFailedPostingsErrorMessage}
                retryOutcome={retryFailedPostingsOutcome}
                onRetry={handleRetryFailedPostings}
              />
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <DialogFooter>
          <SecondaryButton label="Batal" outlined onClick={handleClose} disabled={isClosing} type="button" />
          <PrimaryButton
            label="Tutup Periode"
            onClick={handleSubmit}
            disabled={isReasonEmpty || isClosing}
            loading={isClosing}
            type="button"
          />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
