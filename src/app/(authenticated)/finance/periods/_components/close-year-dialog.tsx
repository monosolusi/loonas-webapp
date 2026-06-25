"use client";

import { useState } from "react";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { DangerButton } from "@/core/presentations/components/buttons/danger-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { LedgerAccountCombobox } from "@/features/accounting/presentations/components/ledger-account-combobox";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { useRetainedEarningsAccount } from "@/features/accounting/presentations/hooks/use-retained-earnings-account";
import { usePeriods } from "@/app/(authenticated)/finance/periods/_providers/periods-provider";

export function CloseYearDialog() {
  const { selectedYear, isCloseYearDialogOpen, dismissCloseYearDialog, closeYearError, isClosingYear, handleCloseYear } =
    usePeriods();

  const defaultRetainedAccount = useRetainedEarningsAccount();

  const [retainedAccount, setRetainedAccount] = useState<LedgerAccountEntity | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);

  // Sync default once loaded
  const effectiveAccount = retainedAccount ?? defaultRetainedAccount;

  const handleClose = () => {
    if (isClosingYear) return;
    setRetainedAccount(null);
    setAcknowledged(false);
    dismissCloseYearDialog();
  };

  const handleSubmit = async () => {
    if (!acknowledged || isClosingYear) return;
    const ok = await handleCloseYear(effectiveAccount?.id);
    if (ok) {
      setRetainedAccount(null);
      setAcknowledged(false);
    }
  };

  return (
    <LoonasDialog
      open={isCloseYearDialogOpen}
      onClose={handleClose}
      title="Tutup Tahun Buku"
      width="md"
      allowDismiss={!isClosingYear}
    >
      <div className="mt-4 flex flex-col gap-y-4">
        <p className="text-sm text-neutral-500">
          Anda akan menutup tahun buku <span className="font-semibold">{selectedYear}</span>. Menutup tahun buku akan
          memposting jurnal penutup dan menggulung laba/rugi bersih ke akun Saldo Laba Ditahan. Tindakan ini dapat
          dibatalkan, tetapi hanya oleh admin.
        </p>

        <LedgerAccountCombobox
          label="Akun Saldo Laba Ditahan"
          value={effectiveAccount}
          onChange={(val) => setRetainedAccount(val)}
          placeholder="Pilih akun ekuitas (kode 3200)"
          required
          disabled={isClosingYear}
        />

        <label className="flex cursor-pointer items-start gap-x-3">
          <input
            type="checkbox"
            autoFocus
            checked={acknowledged}
            onChange={(e) => setAcknowledged(e.target.checked)}
            disabled={isClosingYear}
            className="mt-0.5 size-4 rounded border-neutral-200 text-primary-500 focus:ring-primary-300"
          />
          <span className="text-sm text-neutral-500">
            Saya memahami bahwa penutupan tahun buku akan memposting jurnal penutup dan mengunci semua periode bulan
            dalam tahun <span className="font-semibold">{selectedYear}</span>.
          </span>
        </label>

        {closeYearError && (
          <div className="rounded-lg border border-warning-400 bg-warning-50 px-4 py-3">
            <p className="text-sm text-warning-500">{closeYearError}</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <DialogFooter>
          <SecondaryButton
            label="Batal"
            outlined
            onClick={handleClose}
            disabled={isClosingYear}
            type="button"
          />
          <DangerButton
            label="Tutup Tahun Buku"
            onClick={handleSubmit}
            disabled={!acknowledged || isClosingYear}
            loading={isClosingYear}
            type="button"
          />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
