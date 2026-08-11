"use client";

import Link from "next/link";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import {
  stockRecoveryActions,
  stockRecoveryPathsLabel,
} from "@/features/inventory/presentations/helpers/stock-recovery-actions";

type StockAdjustmentBlockedDialogProps = {
  open: boolean;
  stockItem: StockItemEntity | null;
  onClose: () => void;
};

export function StockAdjustmentBlockedDialog({ open, stockItem, onClose }: StockAdjustmentBlockedDialogProps) {
  // Recovery paths and copy both come from the one helper, so the CTAs and the
  // prose cannot disagree. The list is ordered least- to most-prominent: the last
  // action is the primary button, anything before it an outlined secondary.
  const recoveryActions = stockRecoveryActions(stockItem);
  const recoveryPaths = stockRecoveryPathsLabel(stockItem);
  const secondaryRecoveryActions = recoveryActions.slice(0, -1);
  const primaryRecoveryAction = recoveryActions[recoveryActions.length - 1];

  return (
    <LoonasDialog title="Tidak Dapat Menyesuaikan Stok" width="lg" open={open} onClose={onClose}>
      <div className="mt-2 flex flex-col gap-y-4">
        {stockItem && (
          <div className="flex flex-col gap-y-1">
            <span className="text-sm font-medium text-neutral-500">{stockItem.itemName}</span>
            {stockItem.variantName && <span className="text-xs text-neutral-300">{stockItem.variantName}</span>}
          </div>
        )}

        <div className="rounded-lg border border-warning-400 bg-warning-50 px-4 py-3">
          <p className="text-sm leading-5 text-warning-500">
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
          {secondaryRecoveryActions.map((action) => (
            <Link key={action.href} href={action.href} className="w-full sm:w-auto">
              <SecondaryButton outlined label={action.label} className="w-full px-6 sm:w-auto" />
            </Link>
          ))}
          <Link href={primaryRecoveryAction.href} className="w-full sm:w-auto">
            <PrimaryButton label={primaryRecoveryAction.label} className="w-full px-6 sm:w-auto" />
          </Link>
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
