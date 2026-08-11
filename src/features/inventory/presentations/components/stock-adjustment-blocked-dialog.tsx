"use client";

import Link from "next/link";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { useLatchedValue } from "@/core/presentations/hooks/use-latched-value";
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
  // The parent nulls `stockItem` the instant the dialog closes, while the panel
  // is still playing its ~200ms leave transition. Render the whole body from the
  // latched item so the name, the balance and the CTAs stay put while it fades
  // instead of blanking one by one.
  const item = useLatchedValue(stockItem);

  // Null only before the dialog has ever opened — `open` is false in that window
  // and Headless UI renders nothing anyway, so this skips no leave animation.
  if (!item) return null;

  // Recovery paths and copy both come from the one helper, so the CTAs and the
  // prose cannot disagree. The list is ordered least- to most-prominent: the last
  // action is the primary button, anything before it an outlined secondary.
  const recoveryActions = stockRecoveryActions(item);
  const secondaryRecoveryActions = recoveryActions.slice(0, -1);
  const primaryRecoveryAction = recoveryActions[recoveryActions.length - 1];

  return (
    <LoonasDialog title="Tidak Dapat Menyesuaikan Stok" width="lg" open={open} onClose={onClose}>
      <div className="mt-2 flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-1">
          <span className="text-sm font-medium text-neutral-500">{item.itemName}</span>
          {item.variantName && <span className="text-xs text-neutral-300">{item.variantName}</span>}
        </div>

        <div className="rounded-lg border border-warning-400 bg-warning-50 px-4 py-3">
          <p className="text-sm leading-5 text-warning-500">
            Saldo stok saat ini{" "}
            <span className="font-semibold">
              <NumberDisplay value={item.currentStock} />
            </span>{" "}
            — penyesuaian stok hanya bisa dilakukan saat saldo 0 atau lebih.
          </p>
        </div>

        <p className="text-sm leading-5 text-neutral-300">
          Catat {stockRecoveryPathsLabel(item)} terlebih dahulu untuk memulihkan saldo. Setelah saldo kembali 0 atau
          lebih, penyesuaian stok bisa dilakukan lagi.
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
