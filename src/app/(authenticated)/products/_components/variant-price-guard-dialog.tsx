"use client";

import { CurrencyDisplay } from "@/core/presentations/components/currency-display";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { formatMinQty } from "@/features/product/presentations/helpers/price-tier-form";
import { OffendingTier } from "@/features/product/presentations/helpers/price-tier-error";

type VariantPriceGuardDialogProps = {
  open: boolean;
  offendingTiers: OffendingTier[];
  newPrice: number | null;
  onClose: () => void;
};

export function VariantPriceGuardDialog({ open, offendingTiers, newPrice, onClose }: VariantPriceGuardDialogProps) {
  return (
    <LoonasDialog title="Harga dasar terlalu rendah" width="md" open={open} onClose={onClose}>
      <div className="mt-2 flex flex-col gap-y-4">
        <p className="text-sm text-neutral-300">
          Harga dasar harus sama atau lebih tinggi dari setiap harga grosir yang aktif. Perubahan harga dibatalkan dan
          harga lama dikembalikan.
        </p>

        {newPrice !== null && (
          <div className="flex flex-row items-baseline justify-between gap-x-3 rounded-lg bg-neutral-50 px-4 py-3 text-sm">
            <span className="text-neutral-400">Harga yang ditolak</span>
            <span className="font-semibold tabular-nums text-neutral-500">
              <CurrencyDisplay value={newPrice} />
            </span>
          </div>
        )}

        {offendingTiers.length > 0 && (
          <div className="flex flex-col gap-y-2">
            <span className="text-sm font-medium text-neutral-500">Harga grosir yang bentrok</span>
            <div className="flex flex-col">
              {/* Every offending tier, never just the first. */}
              {offendingTiers.map((tier) => (
                <div
                  key={`${tier.minQty}-${tier.unitPrice}`}
                  className="flex flex-row items-baseline justify-between gap-x-3 border-b border-b-neutral-100 py-2 text-sm last:border-b-0"
                >
                  <span className="text-neutral-400">Mulai {formatMinQty(tier.minQty)}</span>
                  <span className="font-medium tabular-nums text-neutral-500">
                    <CurrencyDisplay value={tier.unitPrice} />
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
          <PrimaryButton label="Mengerti" onClick={onClose} className="w-auto px-6" />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
