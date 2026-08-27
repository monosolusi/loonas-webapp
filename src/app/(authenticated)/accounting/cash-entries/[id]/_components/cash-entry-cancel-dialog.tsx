"use client";

import { useState } from "react";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { useCashEntryDetail } from "@/app/(authenticated)/accounting/cash-entries/[id]/_providers/cash-entry-detail-provider";

const MAX_NOTE_LENGTH = 1000;

export function CashEntryCancelDialog() {
  const { entry, cancelDialogOpen, isCancelling, cancelFormError, closeCancelDialog, submitCancel } =
    useCashEntryDetail();

  const [note, setNote] = useState("");

  const handleClose = () => {
    if (isCancelling) return;
    setNote("");
    closeCancelDialog();
  };

  const handleSubmit = async () => {
    if (isCancelling) return;
    const ok = await submitCancel(note);
    if (ok) setNote("");
  };

  return (
    <LoonasDialog
      open={cancelDialogOpen}
      onClose={handleClose}
      title="Batalkan Entri Kas"
      width="sm"
      allowDismiss={!isCancelling}
    >
      <div className="mt-4 flex flex-col gap-y-4">
        <p className="text-sm text-neutral-500">
          Anda akan membatalkan entri kas <span className="font-medium">{entry.referenceNumber}</span> sebesar{" "}
          <span className="font-medium">
            <NumberDisplay value={entry.amount} prefix="Rp" />
          </span>
          . Pembatalan akan dicatat sebagai entri kas baru bertanggal hari ini — entri asli akan tetap terlihat
          dengan status dibatalkan.
        </p>

        <div className="flex flex-col gap-y-1.5">
          <label htmlFor="cancel-note" className="text-sm font-medium text-neutral-500">
            Catatan (opsional)
          </label>
          <textarea
            id="cancel-note"
            rows={4}
            maxLength={MAX_NOTE_LENGTH}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Tuliskan catatan pembatalan (opsional)..."
            disabled={isCancelling}
            aria-describedby="cancel-note-counter"
            className="w-full resize-none rounded-lg border border-neutral-100 px-3 py-2 text-sm text-neutral-500 placeholder:text-neutral-200 focus:border-primary-300 focus:outline-none disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-300"
          />
          <p id="cancel-note-counter" className="text-right text-xs tabular-nums text-neutral-300">
            {note.length}/{MAX_NOTE_LENGTH}
          </p>
        </div>

        {cancelFormError && (
          <div className="rounded-lg border border-error-300 bg-error-50 px-4 py-3">
            <p className="text-sm text-error-500">{cancelFormError}</p>
          </div>
        )}

        <DialogFooter>
          <SecondaryButton outlined type="button" label="Batal" disabled={isCancelling} onClick={handleClose} />
          <PrimaryButton
            type="button"
            label="Batalkan Entri"
            loading={isCancelling}
            loadingLabel="Membatalkan..."
            disabled={isCancelling}
            onClick={handleSubmit}
          />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
