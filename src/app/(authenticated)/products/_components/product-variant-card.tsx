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
  hideVariantToggle?: boolean;
  defaultVariantSeed?: { key: string; sku: string };
};

export function ProductVariantCard({
  hasVariants,
  singlePrice,
  variants,
  onHasVariantsChange,
  onSinglePriceChange,
  onVariantsChange,
  hideVariantToggle,
  defaultVariantSeed,
}: ProductVariantCardProps) {
  const [disableDialogOpen, setDisableDialogOpen] = useState(false);

  const hasVariantData =
    variants.length > 1 || variants.some((v) => v.name.trim() || v.sku.trim() || v.price > 0);

  const handleToggle = (enabled: boolean) => {
    if (!enabled && hasVariantData) {
      setDisableDialogOpen(true);
      return;
    }
    // LNS-570: when a Default variant exists on the server, row 1 MUST carry its id — its grosir
    // tiers and recipe hang off that id, and a fresh crypto.randomUUID() plans the toggle as
    // delete-then-add and destroys both. Seeded unconditionally when the variant exists, not only
    // when singlePrice > 0: a zero price is no reason to orphan a recipe. `name` is deliberately
    // left blank so the merchant must name the variant — saving it as "Default" would make the
    // product read back as single-price on the next hydration.
    if (enabled && (singlePrice > 0 || defaultVariantSeed)) {
      onVariantsChange([
        {
          key: defaultVariantSeed?.key ?? crypto.randomUUID(),
          name: "",
          sku: defaultVariantSeed?.sku ?? "",
          price: singlePrice,
        },
      ]);
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
          {!hideVariantToggle && (
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
          )}

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
