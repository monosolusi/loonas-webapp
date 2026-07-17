"use client";

import { useState, useMemo } from "react";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { usePeriods } from "@/app/(authenticated)/finance/periods/_providers/periods-provider";
import { ClosePeriodEscalationHint } from "@/features/accounting/presentations/components/close-period-escalation-hint";

export function ClosePeriodDialog() {
  const { closingPeriod, dismissCloseDialog, closePeriodError, closePeriodFailureCount, isClosing, handleClosePeriod } =
    usePeriods();

  const [reason, setReason] = useState("");

  const isOpen = closingPeriod !== null;
  const isReasonEmpty = useMemo(() => reason.trim().length === 0, [reason]);

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
      open={isOpen}
      onClose={handleClose}
      title="Tutup Periode"
      width="sm"
      allowDismiss={!isClosing}
    >
      <div className="mt-4 flex flex-col gap-y-4">
        {closingPeriod && (
          <p className="text-sm text-neutral-500">
            Anda akan mengunci periode <span className="font-semibold">{closingPeriod.label}</span>. Setelah dikunci, jurnal tidak dapat diposting ke periode ini.
          </p>
        )}

        <div className="flex flex-col gap-y-1.5">
          <label htmlFor="close-reason" className="text-sm font-medium text-neutral-500">
            Alasan penutupan <span className="text-error-300">*</span>
          </label>
          <textarea
            id="close-reason"
            autoFocus
            rows={3}
            maxLength={500}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Tuliskan alasan penutupan periode..."
            className="w-full resize-none rounded-lg border border-neutral-100 px-3 py-2 text-sm text-neutral-500 placeholder:text-neutral-200 focus:border-primary-300 focus:outline-none"
          />
          {isReasonEmpty && reason !== "" && (
            <p className="text-xs text-error-300">Alasan tidak boleh kosong.</p>
          )}
        </div>

        <div role="status" aria-live="polite" aria-atomic="false">
          {closePeriodError && (
            <div key={closePeriodFailureCount} className="rounded-lg border border-warning-400 bg-warning-50 px-4 py-3">
              <p className="text-sm text-warning-500">{closePeriodError}</p>
              {closePeriodFailureCount >= 2 && <ClosePeriodEscalationHint />}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6">
        <DialogFooter>
          <SecondaryButton
            label="Batal"
            outlined
            onClick={handleClose}
            disabled={isClosing}
            type="button"
          />
          <PrimaryButton
            label="Tutup periode"
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
