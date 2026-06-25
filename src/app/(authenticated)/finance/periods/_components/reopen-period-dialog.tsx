"use client";

import { useState, useMemo } from "react";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { usePeriods } from "@/app/(authenticated)/finance/periods/_providers/periods-provider";

const MIN_REASON_LENGTH = 10;
const MAX_REASON_LENGTH = 500;

export function ReopenPeriodDialog() {
  const { reopeningPeriod, dismissReopenDialog, reopenPeriodError, isReopening, handleReopenPeriod } = usePeriods();

  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);

  const isOpen = reopeningPeriod !== null;

  const reasonError = useMemo((): string | null => {
    if (!touched) return null;
    if (reason.trim().length === 0) return "Alasan tidak boleh kosong.";
    if (reason.trim().length < MIN_REASON_LENGTH) return `Alasan minimal ${MIN_REASON_LENGTH} karakter.`;
    return null;
  }, [reason, touched]);

  const isValid = useMemo(
    () => reason.trim().length >= MIN_REASON_LENGTH && reason.trim().length <= MAX_REASON_LENGTH,
    [reason],
  );

  const handleClose = () => {
    if (isReopening) return;
    setReason("");
    setTouched(false);
    dismissReopenDialog();
  };

  const handleSubmit = async () => {
    setTouched(true);
    if (!isValid || isReopening) return;
    const ok = await handleReopenPeriod(reason.trim());
    if (ok) {
      setReason("");
      setTouched(false);
    }
  };

  return (
    <LoonasDialog
      open={isOpen}
      onClose={handleClose}
      title="Buka Kembali Periode"
      width="sm"
      allowDismiss={!isReopening}
    >
      <div className="mt-4 flex flex-col gap-y-4">
        {reopeningPeriod && (
          <p className="text-sm text-neutral-500">
            Anda akan membuka kembali periode <span className="font-semibold">{reopeningPeriod.label}</span>. Periode yang sudah dibuka dapat menerima jurnal baru.
          </p>
        )}

        <div className="flex flex-col gap-y-1.5">
          <label htmlFor="reopen-reason" className="text-sm font-medium text-neutral-500">
            Alasan pembukaan kembali <span className="text-error-300">*</span>
          </label>
          <textarea
            id="reopen-reason"
            autoFocus
            rows={3}
            maxLength={MAX_REASON_LENGTH}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Tuliskan alasan pembukaan kembali periode (min. 10 karakter)..."
            className="w-full resize-none rounded-lg border border-neutral-100 px-3 py-2 text-sm text-neutral-500 placeholder:text-neutral-200 focus:border-primary-300 focus:outline-none"
          />
          {reasonError && (
            <p className="text-xs text-error-300">{reasonError}</p>
          )}
        </div>

        {reopenPeriodError && (
          <div className="rounded-lg border border-error-300 bg-error-50 px-4 py-3">
            <p className="text-sm text-error-500">{reopenPeriodError}</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <DialogFooter>
          <SecondaryButton
            label="Batal"
            outlined
            onClick={handleClose}
            disabled={isReopening}
            type="button"
          />
          <PrimaryButton
            label="Buka kembali periode"
            onClick={handleSubmit}
            disabled={!isValid || isReopening}
            loading={isReopening}
            type="button"
          />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
