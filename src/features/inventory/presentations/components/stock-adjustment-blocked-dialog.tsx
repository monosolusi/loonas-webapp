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
  canRecoverByProduction,
  RECORD_PRODUCTION,
  RECORD_PURCHASE,
} from "@/features/inventory/presentations/helpers/stock-item-actions";

type StockAdjustmentBlockedDialogProps = {
  open: boolean;
  stockItem: StockItemEntity | null;
  onClose: () => void;
};

export function StockAdjustmentBlockedDialog({ open, stockItem, onClose }: StockAdjustmentBlockedDialogProps) {
  // The parent nulls `stockItem` the instant the dialog closes, while the panel
  // is still playing its ~200ms leave transition. Render the whole body from the
  // latched item so the name, the balance and the actions stay put while it
  // fades instead of blanking one by one.
  const item = useLatchedValue(stockItem);

  // Null only before the dialog has ever opened — `open` is false in that window
  // and Headless UI renders nothing anyway, so this skips no leave animation.
  if (!item) return null;

  // Drives the inline recovery-path sentence (production as a link vs.
  // purchasing-only) against the item-type-agnostic footer below, so the two
  // cannot disagree. The rule itself lives in the helper, shared with the form
  // dialog and the row action menu.
  const canBeProduced = canRecoverByProduction(item);

  return (
    <LoonasDialog title="Stok Minus, Belum Bisa Disesuaikan" width="lg" open={open} onClose={onClose}>
      <div className="mt-2 flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-1">
          <span className="text-sm font-medium text-neutral-500">{item.itemName}</span>
          {item.variantName && <span className="text-xs text-neutral-300">{item.variantName}</span>}
        </div>

        <div className="rounded-lg border border-warning-400 bg-warning-50 px-4 py-3">
          <p className="text-sm leading-5 text-warning-500">
            Stok sekarang{" "}
            <span className="font-semibold">
              <NumberDisplay value={item.currentStock} />
            </span>
            . Penyesuaian hanya bisa saat stok 0 atau lebih.
          </p>
        </div>

        <p className="text-sm leading-5 text-neutral-300">
          {canBeProduced ? (
            <>
              Catat dulu pembelian atau{" "}
              <Link href={RECORD_PRODUCTION.href} className="text-primary-400 underline hover:text-primary-500">
                produksi
              </Link>{" "}
              yang belum masuk. Setelah stok tidak minus, penyesuaian bisa dilakukan.
            </>
          ) : (
            "Catat dulu pembelian yang belum masuk. Setelah stok tidak minus, penyesuaian bisa dilakukan."
          )}
        </p>

        {/* Exactly 2 buttons for every item type: Tutup (dismiss) then Catat Pembelian
            (the one recovery path valid for every item type). The production path lives
            as the inline link above, not a third footer button — do not reintroduce it
            here. */}
        <DialogFooter>
          <SecondaryButton outlined label="Tutup" onClick={onClose} />
          <Link href={RECORD_PURCHASE.href} className="w-full">
            <PrimaryButton label={RECORD_PURCHASE.label} className="px-6" />
          </Link>
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
