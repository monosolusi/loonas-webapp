"use client";

import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { useOverheadAccounts } from "@/app/(authenticated)/accounting/overhead-accounts/_providers/overhead-accounts-provider";

export function OverheadAccountsClearAllDialog() {
  const { confirmClearOpen, closeConfirmClear, confirmClearAndSave, isSaving } = useOverheadAccounts();

  return (
    <LoonasDialog
      title="Kosongkan Akun Overhead?"
      width="sm"
      open={confirmClearOpen}
      onClose={closeConfirmClear}
      allowDismiss={!isSaving}
    >
      <div className="mt-4 flex flex-col gap-y-5">
        <p className="text-sm text-neutral-400">
          Semua akun overhead yang tersimpan akan dihapus. Biaya overhead produksi tidak akan ditandai dari akun mana
          pun sampai Anda memilih akun baru.
        </p>
        <DialogFooter>
          <SecondaryButton outlined label="Batal" onClick={closeConfirmClear} disabled={isSaving} />
          <PrimaryButton
            label="Ya, Kosongkan"
            loading={isSaving}
            loadingLabel="Menyimpan…"
            onClick={() => void confirmClearAndSave()}
            className="px-6"
          />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
