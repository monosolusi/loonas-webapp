"use client";

import { useProfitabilityDetail } from "@/app/(authenticated)/accounting/profitability/[productId]/[variantId]/_providers/profitability-detail-provider";
import { useGetVariantCogs } from "@/features/profitability/presentations/hooks/use-get-variant-cogs";
import { CogsBlockLoading } from "@/app/(authenticated)/accounting/profitability/[productId]/[variantId]/_components/cogs-block-loading";
import { DataKurangCard } from "@/app/(authenticated)/accounting/profitability/[productId]/[variantId]/_components/data-kurang-card";
import { CogsBlockError } from "@/app/(authenticated)/accounting/profitability/[productId]/[variantId]/_components/cogs-block-error";
import { CogsBlockBody } from "@/app/(authenticated)/accounting/profitability/[productId]/[variantId]/_components/cogs-block-body";

export function CogsBlock() {
  const { productId, variantId } = useProfitabilityDetail();
  const state = useGetVariantCogs({ productId, variantId });
  const refresh = state.refresh;

  if (state.loading) return <CogsBlockLoading />;
  if (state.isIncompleteRecipe)
    return (
      <DataKurangCard
        title="HPP"
        description="HPP tidak bisa dihitung karena resep atau harga bahan baku produk ini belum diisi."
        productId={productId}
      />
    );
  if (state.error) return <CogsBlockError onRetry={() => { if (refresh) refresh(); }} />;
  return <CogsBlockBody cogs={state.data} />;
}
