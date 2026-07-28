"use client";

import { useEffect, useMemo, useState } from "react";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { TierMode, TierModeType } from "@/features/product/domain/enums/tier-mode";
import { PRODUCT_SWR_KEYS } from "@/features/product/presentations/constants/swr-keys";
import { useGetPriceTiers } from "@/features/product/presentations/hooks/use-get-price-tiers";
import { useSavePriceTiers } from "@/features/product/presentations/hooks/use-save-price-tiers";
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

export function PriceTierEditDialog() {
  const { showToast } = useToast();
  const { productId, editorTarget, closeEditor } = usePriceTier();
  const { trigger: savePriceTiers, isMutating } = useSavePriceTiers();

  const state = useGetPriceTiers({ productId, variantId: editorTarget?.variantId ?? null });

  const [tierMode, setTierMode] = useState<TierModeType>(TierMode.VOLUME);
  const [rows, setRows] = useState<PriceTierFormRow[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [offendingVariants, setOffendingVariants] = useState<OffendingVariant[]>([]);
  const [hydratedFor, setHydratedFor] = useState<string | null>(null);

  // Reset only when the dialog closes. A 422 never closes it, so the user's unsaved rows
  // survive a rejection.
  useEffect(() => {
    if (editorTarget) return;
    setRows([]);
    setHydratedFor(null);
    setFormError(null);
    setOffendingVariants([]);
  }, [editorTarget]);

  // Hydrate once per variant. Without this guard a background SWR revalidation would
  // silently overwrite rows the user is still editing — including right after a 422.
  useEffect(() => {
    if (!editorTarget || state.status !== "loaded") return;
    if (hydratedFor === editorTarget.variantId) return;
    setTierMode(state.schedule.tierMode);
    setRows(scheduleToFormRows(state.schedule.tiers));
    setHydratedFor(editorTarget.variantId);
  }, [editorTarget, state, hydratedFor]);

  const { rowErrors, isValid } = useMemo(() => validatePriceTierRows(rows), [rows]);

  const handleRowChange = (key: string, updates: Partial<PriceTierFormRow>) => {
    setRows((prev) => prev.map((row) => (row.key === key ? { ...row, ...updates } : row)));
  };

  // No floor: removing the last row is how a schedule is cleared.
  const handleRemoveRow = (key: string) => {
    setRows((prev) => prev.filter((row) => row.key !== key));
  };

  const handleSubmit = async () => {
    if (!editorTarget || !isValid || isMutating) return;
    setFormError(null);
    setOffendingVariants([]);

    const isClearing = rows.length === 0;

    try {
      await savePriceTiers({
        productId,
        variantId: editorTarget.variantId,
        tierMode,
        tiers: toSaveTiers(rows),
      });
      showToast(isClearing ? "Harga grosir dihapus" : "Harga grosir berhasil disimpan", "success");
      closeEditor();
      await revalidateSWRKey(
        PRODUCT_SWR_KEYS.GET_PRICE_TIERS,
        PRODUCT_SWR_KEYS.GET_PRODUCT,
        PRODUCT_SWR_KEYS.LIST_PRODUCTS,
        PRODUCT_SWR_KEYS.LIST_PRODUCTS_FOR_SALE,
      );
    } catch (err) {
      const info = describePriceTierError(err, "variant");

      if (info.kind === "schedule-invalid") {
        setFormError(info.message);
        setOffendingVariants(info.offendingVariants);
        return;
      }

      if (info.kind === "not-found") {
        showToast(info.message, "error");
        closeEditor();
        try {
          await revalidateSWRKey(PRODUCT_SWR_KEYS.GET_PRODUCT, PRODUCT_SWR_KEYS.LIST_PRODUCTS);
        } catch {
          // The user has already been told.
        }
        return;
      }

      // 400 and anything unrecognised stay in the dialog as a banner, distinct from the
      // four domain reasons, with the rows intact.
      setFormError(info.message);
    }
  };

  return (
    <PriceTierFormDialog
      open={!!editorTarget}
      title={`Harga Grosir — ${editorTarget?.variantName ?? ""}`}
      subtitle={editorTarget ? `Harga dasar tersimpan: Rp ${editorTarget.basePrice.toLocaleString("id-ID")}` : undefined}
      submitLabel={rows.length === 0 ? "Hapus Harga Grosir" : "Simpan"}
      tierMode={tierMode}
      rows={rows}
      rowErrors={rowErrors}
      formError={formError}
      offendingVariants={offendingVariants}
      loadError={state.status === "error" ? state.error : null}
      loading={state.status === "loading"}
      isSubmitting={isMutating}
      isValid={isValid}
      onTierModeChange={setTierMode}
      onRowChange={handleRowChange}
      onAddRow={() => setRows((prev) => [...prev, createEmptyPriceTierRow()])}
      onRemoveRow={handleRemoveRow}
      onRetryLoad={state.refresh}
      onSubmit={handleSubmit}
      onClose={closeEditor}
    />
  );
}
