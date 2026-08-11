"use client";

import Link from "next/link";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";

type StockAdjustmentBlockedDialogProps = {
  open: boolean;
  stockItem: StockItemEntity | null;
  onClose: () => void;
};

export function StockAdjustmentBlockedDialog({ open, stockItem, onClose }: StockAdjustmentBlockedDialogProps) {
  // Only finished goods are produced; raw materials are restocked by purchasing
  // alone. Drives both the recovery-path copy and the production CTA so the two
  // cannot disagree.
  const canBeProduced = stockItem?.isFinishedGoods ?? false;
  const recoveryPaths = canBeProduced ? "pembelian atau produksi" : "pembelian";

  return (
    <LoonasDialog title="Tidak Dapat Menyesuaikan Stok" width="lg" open={open} onClose={onClose}>
      <div className="mt-2 flex flex-col gap-y-4">
        {stockItem && (
          <div className="flex flex-col gap-y-1">
            <span className="text-sm font-medium text-neutral-500">{stockItem.itemName}</span>
            {stockItem.variantName && <span className="text-xs text-neutral-300">{stockItem.variantName}</span>}
          </div>
        )}

        <div className="rounded-lg border border-warning-200 bg-warning-50 px-4 py-3" role="alert">
          <p className="text-sm leading-5 text-warning-400">
            Saldo stok saat ini{" "}
            <span className="font-semibold">{stockItem && <NumberDisplay value={stockItem.currentStock} />}</span> —
            penyesuaian stok hanya bisa dilakukan saat saldo 0 atau lebih.
          </p>
        </div>

        <p className="text-sm leading-5 text-neutral-300">
          Catat {recoveryPaths} terlebih dahulu untuk memulihkan saldo. Setelah saldo kembali 0 atau lebih, penyesuaian
          stok bisa dilakukan lagi.
        </p>

        <DialogFooter>
          <SecondaryButton outlined label="Tutup" onClick={onClose} />
          {canBeProduced && (
            <Link href="/productions/create" className="w-full sm:w-auto">
              <SecondaryButton outlined label="Catat Produksi" className="w-full px-6 sm:w-auto" />
            </Link>
          )}
          <Link href="/purchasing/create" className="w-full sm:w-auto">
            <PrimaryButton label="Catat Pembelian" className="w-full px-6 sm:w-auto" />
          </Link>
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
