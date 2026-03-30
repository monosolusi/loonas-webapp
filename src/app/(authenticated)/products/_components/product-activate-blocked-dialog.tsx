"use client";

import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";

type ProductActivateBlockedDialogProps = {
  open: boolean;
  missingVariants: string[];
  onClose: () => void;
};

export function ProductActivateBlockedDialog({ open, missingVariants, onClose }: ProductActivateBlockedDialogProps) {
  return (
    <LoonasDialog title="Tidak Dapat Mengaktifkan Produk" width="sm" open={open} onClose={onClose}>
      <div className="mt-2 flex flex-col gap-y-4">
        <div className="rounded-lg border border-warning-200 bg-warning-50 px-4 py-3">
          <p className="text-sm text-warning-400">
            {missingVariants.length > 0 ? (
              <>
                Varian berikut belum memiliki resep:{" "}
                <span className="font-semibold">{missingVariants.join(", ")}</span>.
              </>
            ) : (
              <>Belum ada varian yang memiliki resep.</>
            )}
          </p>
        </div>
        <p className="text-sm text-neutral-300">
          Lengkapi resep semua varian terlebih dahulu untuk mengaktifkan produk.
        </p>
        <DialogFooter>
          <PrimaryButton label="Mengerti" onClick={onClose} />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
