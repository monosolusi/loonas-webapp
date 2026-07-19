"use client";

import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { useOpeningBalanceWizard } from "@/app/(authenticated)/accounting/opening-balance/_providers/opening-balance-wizard-provider";

export function WizardConfirmDialog() {
  const { confirmModalOpen, isSubmitting, submitError, closeConfirmModal, handleSubmit } =
    useOpeningBalanceWizard();

  return (
    <LoonasDialog
      open={confirmModalOpen}
      onClose={closeConfirmModal}
      allowDismiss={!isSubmitting}
      title="Konfirmasi penyimpanan"
      width="md"
    >
      <p className="mt-2 text-sm text-neutral-400">
        Setelah disimpan, saldo awal tidak dapat diubah. Pastikan angka yang Anda masukkan sudah benar.
      </p>

      {submitError && (
        <p role="alert" className="mt-3 text-xs text-error-400">
          {submitError}
        </p>
      )}

      <div className="mt-4">
        <DialogFooter>
          <SecondaryButton
            outlined
            label="Batal"
            disabled={isSubmitting}
            onClick={closeConfirmModal}
            className="w-auto px-6"
          />
          <PrimaryButton
            label="Simpan Sekarang"
            loadingLabel="Menyimpan…"
            loading={isSubmitting}
            disabled={isSubmitting}
            onClick={handleSubmit}
            className="w-auto px-6"
            aria-busy={isSubmitting}
          />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
