"use client";

import { useState } from "react";
import { Switch } from "@headlessui/react";
import clsx from "clsx";
import { SectionCard } from "@/core/presentations/components/section-card";
import { CurrencyInput } from "@/core/presentations/components/text-inputs/currency-input";
import { ConfirmationDialog } from "@/core/presentations/components/confirmation-dialog";
import { VariantTable, VariantFormRow } from "@/app/(authenticated)/products/_components/variant-table";

type ProductVariantCardProps = {
  hasVariants: boolean;
  singlePrice: number;
  variants: VariantFormRow[];
  onHasVariantsChange: (enabled: boolean) => void;
  onSinglePriceChange: (price: number) => void;
  onVariantsChange: (variants: VariantFormRow[]) => void;
};

export function ProductVariantCard({
  hasVariants,
  singlePrice,
  variants,
  onHasVariantsChange,
  onSinglePriceChange,
  onVariantsChange,
}: ProductVariantCardProps) {
  const [disableDialogOpen, setDisableDialogOpen] = useState(false);

  const hasVariantData =
    variants.length > 1 || variants.some((v) => v.name.trim() || v.sku.trim() || v.price > 0);

  const handleToggle = (enabled: boolean) => {
    if (!enabled && hasVariantData) {
      setDisableDialogOpen(true);
      return;
    }
    if (enabled && singlePrice > 0) {
      onVariantsChange([{ key: crypto.randomUUID(), name: "", sku: "", price: singlePrice }]);
    }
    if (!enabled && variants.length > 0 && variants[0].price > 0) {
      onSinglePriceChange(variants[0].price);
    }
    onHasVariantsChange(enabled);
  };

  const applyDisable = () => {
    onVariantsChange([{ key: crypto.randomUUID(), name: "", sku: "", price: 0 }]);
    onHasVariantsChange(false);
    setDisableDialogOpen(false);
  };

  return (
    <>
      <SectionCard title="Harga & Varian" iconSrc="/assets/images/credit-card-icon-primary-300-w16-h16.svg">
        <div className="flex flex-col gap-y-5">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col gap-y-0.5">
              <span className="text-sm font-medium text-neutral-500">Produk ini memiliki varian</span>
              <span className="text-xs text-neutral-200">Aktifkan jika produk memiliki ukuran, rasa, atau kemasan berbeda</span>
            </div>
            <Switch
              checked={hasVariants}
              onChange={handleToggle}
              className={clsx(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out",
                hasVariants ? "bg-primary-300" : "bg-neutral-100",
              )}
            >
              <span
                className={clsx(
                  "pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  hasVariants ? "translate-x-5" : "translate-x-0",
                )}
              />
            </Switch>
          </div>

          {hasVariants ? (
            <VariantTable variants={variants} onChange={onVariantsChange} />
          ) : (
            <CurrencyInput label="Harga Jual" placeholder="0" value={singlePrice} onChange={onSinglePriceChange} />
          )}
        </div>
      </SectionCard>

      <ConfirmationDialog
        open={disableDialogOpen}
        onClose={() => setDisableDialogOpen(false)}
        title="Nonaktifkan Varian"
        description="Data varian yang telah diisi akan dihapus. Apakah Anda yakin ingin melanjutkan?"
        confirmLabel="Lanjutkan"
        onConfirm={applyDisable}
      />
    </>
  );
}
