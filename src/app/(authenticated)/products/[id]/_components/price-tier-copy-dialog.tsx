"use client";

import { useEffect, useMemo, useState } from "react";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { ConfirmationDialog } from "@/core/presentations/components/confirmation-dialog";
import { TierMode, TierModeType } from "@/features/product/domain/enums/tier-mode";
import { PRODUCT_SWR_KEYS } from "@/features/product/presentations/constants/swr-keys";
import { useCopyPriceTiers } from "@/features/product/presentations/hooks/use-copy-price-tiers";
import { describePriceTierError, OffendingVariant } from "@/features/product/presentations/helpers/price-tier-error";
import {
  createEmptyPriceTierRow,
  scheduleToFormRows,
  toSaveTiers,
  validatePriceTierRows,
} from "@/features/product/presentations/helpers/price-tier-form";
import { PriceTierFormRow } from "@/features/product/presentations/types/price-tier-form.types";
import { PriceTierFormDialog } from "@/app/(authenticated)/products/_components/price-tier-form-dialog";
import { usePriceTier } from "@/app/(authenticated)/products/[id]/_providers/price-tier-provider";

export function PriceTierCopyDialog() {
  const { showToast } = useToast();
  const { productId, hydratedVariants, copyOpen, closeCopy } = usePriceTier();
  const { trigger: copyPriceTiers, isMutating } = useCopyPriceTiers();

  const [tierMode, setTierMode] = useState<TierModeType>(TierMode.VOLUME);
  const [rows, setRows] = useState<PriceTierFormRow[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [offendingVariants, setOffendingVariants] = useState<OffendingVariant[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // Seed from the first variant's schedule so the merchant edits a real starting point.
  useEffect(() => {
    if (!copyOpen) {
      setRows([]);
      setFormError(null);
      setOffendingVariants([]);
      setConfirmOpen(false);
      return;
    }
    const seed = hydratedVariants[0]?.priceTierSchedule ?? null;
    setTierMode(seed?.tierMode ?? TierMode.VOLUME);
    setRows(seed ? scheduleToFormRows(seed.tiers) : []);
  }, [copyOpen, hydratedVariants]);

  const { rowErrors, isValid } = useMemo(() => validatePriceTierRows(rows), [rows]);

  const variantsWithSchedule = useMemo(
    () => hydratedVariants.filter((variant) => variant.priceTierSchedule?.hasTiers),
    [hydratedVariants],
  );

  const handleRowChange = (key: string, updates: Partial<PriceTierFormRow>) => {
    setRows((prev) => prev.map((row) => (row.key === key ? { ...row, ...updates } : row)));
  };

  // Opens the confirm. Deliberately does NOT call the mutation — the copy is a full
  // replace onto every live variant, so every invocation is destructive and must be
  // confirmed before any request is sent.
  const handleSubmit = () => {
    if (!isValid || isMutating) return;
    setConfirmOpen(true);
  };

  const handleConfirmCopy = async () => {
    setConfirmOpen(false);
    setFormError(null);
    setOffendingVariants([]);

    try {
      const result = await copyPriceTiers({ productId, tierMode, tiers: toSaveTiers(rows) });
      // The count comes from the response's variant_ids, never from the local variant list.
      showToast(`Harga grosir diterapkan ke ${result.updatedCount} varian`, "success");
      closeCopy();
      await revalidateSWRKey(
        PRODUCT_SWR_KEYS.GET_PRICE_TIERS,
        PRODUCT_SWR_KEYS.GET_PRODUCT,
        PRODUCT_SWR_KEYS.LIST_PRODUCTS,
        PRODUCT_SWR_KEYS.LIST_PRODUCTS_FOR_SALE,
      );
    } catch (err) {
      const info = describePriceTierError(err, "copy");

      if (info.kind === "not-found") {
        showToast(info.message, "error");
        closeCopy();
        try {
          await revalidateSWRKey(PRODUCT_SWR_KEYS.GET_PRODUCT, PRODUCT_SWR_KEYS.LIST_PRODUCTS);
        } catch {
          // The user has already been told.
        }
        return;
      }

      // The copy is transactional, so a domain rejection means nothing changed anywhere.
      // Say so explicitly rather than leaving the merchant to guess which variants were
      // written. The no-variants case already implies it, so it is not prefixed.
      setFormError(
        info.kind === "schedule-invalid" ? `Tidak ada varian yang diubah. ${info.message}` : info.message,
      );
      setOffendingVariants(info.kind === "schedule-invalid" ? info.offendingVariants : []);
    }
  };

  return (
    <>
      <PriceTierFormDialog
        open={copyOpen}
        title="Salin Harga Grosir ke Semua Varian"
        subtitle={`Skema ini akan menggantikan harga grosir di ${hydratedVariants.length} varian.`}
        submitLabel="Terapkan ke Semua"
        tierMode={tierMode}
        rows={rows}
        rowErrors={rowErrors}
        formError={formError}
        offendingVariants={offendingVariants}
        loadError={null}
        loading={false}
        isSubmitting={isMutating}
        isValid={isValid}
        onTierModeChange={setTierMode}
        onRowChange={handleRowChange}
        onAddRow={() => setRows((prev) => [...prev, createEmptyPriceTierRow()])}
        onRemoveRow={(key) => setRows((prev) => prev.filter((row) => row.key !== key))}
        onRetryLoad={() => {}}
        onSubmit={handleSubmit}
        onClose={closeCopy}
      />

      <ConfirmationDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Timpa harga grosir semua varian?"
        warning="Harga grosir yang sudah ada di setiap varian akan diganti dan tidak bisa dikembalikan."
        description={
          <div className="flex flex-col gap-y-2">
            <p>
              Skema ini akan diterapkan ke{" "}
              <span className="font-semibold text-neutral-500">{hydratedVariants.length} varian</span> sekaligus.
            </p>
            {variantsWithSchedule.length > 0 && (
              <p>
                {variantsWithSchedule.length} di antaranya sudah punya harga grosir:{" "}
                <span className="font-semibold text-neutral-500">
                  {variantsWithSchedule.map((variant) => variant.name).join(", ")}
                </span>
                .
              </p>
            )}
          </div>
        }
        confirmLabel="Terapkan ke Semua"
        loading={isMutating}
        onConfirm={handleConfirmCopy}
      />
    </>
  );
}
