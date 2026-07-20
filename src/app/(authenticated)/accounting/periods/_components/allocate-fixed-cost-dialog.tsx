"use client";

import clsx from "clsx";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { usePeriods } from "@/app/(authenticated)/accounting/periods/_providers/periods-provider";

export function AllocateFixedCostDialog() {
  const { allocatingPeriod, dismissAllocateDialog, allocateError, isAllocating, handleAllocate } = usePeriods();

  const isOpen = allocatingPeriod !== null;

  const handleClose = () => {
    if (isAllocating) return;
    dismissAllocateDialog();
  };

  const handleSubmit = async () => {
    if (isAllocating) return;
    await handleAllocate();
  };

  return (
    <LoonasDialog
      open={isOpen}
      onClose={handleClose}
      title="Alokasikan Biaya Tetap Produksi"
      width="sm"
      allowDismiss={!isAllocating}
    >
      <div className="mt-4 flex flex-col gap-y-4">
        {allocatingPeriod && (
          <div className="flex flex-col gap-y-2">
            <p className="text-sm text-neutral-500">
              Anda akan mengalokasikan biaya tetap produksi ke setiap varian yang diproduksi pada periode{" "}
              <span className="font-semibold">{allocatingPeriod.label}</span>.
            </p>
            <p className="text-sm text-neutral-400">
              Ini adalah biaya manajerial dan <span className="font-medium text-neutral-500">tidak</span> mengubah
              HPP di laporan keuangan (GL). Angka ini hanya digunakan untuk analisis biaya produksi internal.
            </p>
          </div>
        )}

        {allocateError && (
          <div className={clsx("rounded-lg border px-4 py-3", "border-warning-400 bg-warning-50")}>
            <p className="text-sm text-warning-500">{allocateError}</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <DialogFooter>
          <SecondaryButton
            label="Batal"
            outlined
            onClick={handleClose}
            disabled={isAllocating}
            type="button"
          />
          <PrimaryButton
            label="Alokasikan"
            onClick={handleSubmit}
            disabled={isAllocating}
            loading={isAllocating}
            type="button"
          />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
