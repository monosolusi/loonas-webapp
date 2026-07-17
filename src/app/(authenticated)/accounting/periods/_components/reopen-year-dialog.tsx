"use client";

import { useState, useMemo } from "react";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { usePeriods } from "@/app/(authenticated)/accounting/periods/_providers/periods-provider";

const MIN_REASON_LENGTH = 10;
const MAX_REASON_LENGTH = 500;

export function ReopenYearDialog() {
  const { selectedYear, isReopenYearDialogOpen, dismissReopenYearDialog, reopenYearError, isReopeningYear, handleReopenYear } =
    usePeriods();

  const [reason, setReason] = useState("");
  const [touched, setTouched] = useState(false);

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
    if (isReopeningYear) return;
    setReason("");
    setTouched(false);
    dismissReopenYearDialog();
  };

  const handleSubmit = async () => {
    setTouched(true);
    if (!isValid || isReopeningYear) return;
    const ok = await handleReopenYear(reason.trim());
    if (ok) {
      setReason("");
      setTouched(false);
    }
  };

  return (
    <LoonasDialog
      open={isReopenYearDialogOpen}
      onClose={handleClose}
      title="Buka Kembali Tahun Buku"
      width="sm"
      allowDismiss={!isReopeningYear}
    >
      <div className="mt-4 flex flex-col gap-y-4">
        <p className="text-sm text-neutral-500">
          Anda akan membuka kembali tahun buku <span className="font-semibold">{selectedYear}</span>. Setelah dibuka,
          jurnal dapat diposting kembali ke periode dalam tahun ini.
        </p>

        <div className="flex flex-col gap-y-1.5">
          <label htmlFor="reopen-year-reason" className="text-sm font-medium text-neutral-500">
            Alasan pembukaan kembali <span className="text-error-300">*</span>
          </label>
          <textarea
            id="reopen-year-reason"
            autoFocus
            rows={3}
            maxLength={MAX_REASON_LENGTH}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Tuliskan alasan pembukaan kembali tahun buku (min. 10 karakter)..."
            className="w-full resize-none rounded-lg border border-neutral-100 px-3 py-2 text-sm text-neutral-500 placeholder:text-neutral-200 focus:border-primary-300 focus:outline-none"
          />
          {reasonError && (
            <p className="text-xs text-error-300">{reasonError}</p>
          )}
        </div>

        {reopenYearError && (
          <div className="rounded-lg border border-error-300 bg-error-50 px-4 py-3">
            <p className="text-sm text-error-500">{reopenYearError}</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <DialogFooter>
          <SecondaryButton
            label="Batal"
            outlined
            onClick={handleClose}
            disabled={isReopeningYear}
            type="button"
          />
          <PrimaryButton
            label="Buka kembali tahun buku"
            onClick={handleSubmit}
            disabled={!isValid || isReopeningYear}
            loading={isReopeningYear}
            type="button"
          />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
