"use client";

import { useProfitabilityDetail } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_providers/profitability-detail-provider";
import { useGetVariantHpp } from "@/features/profitability/presentations/hooks/use-get-variant-hpp";
import { HppBlockLoading } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_components/hpp-block-loading";
import { DataKurangCard } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_components/data-kurang-card";
import { HppBlockError } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_components/hpp-block-error";
import { HppBlockBody } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_components/hpp-block-body";

export function HppBlock() {
  const { productId, variantId } = useProfitabilityDetail();
  const state = useGetVariantHpp({ productId, variantId });
  const refresh = state.refresh;

  if (state.loading) return <HppBlockLoading />;
  if (state.isIncompleteRecipe)
    return (
      <DataKurangCard
        title="HPP"
        description="HPP tidak bisa dihitung karena resep atau harga bahan baku produk ini belum diisi."
        productId={productId}
      />
    );
  if (state.error) return <HppBlockError onRetry={() => { if (refresh) refresh(); }} />;
  return <HppBlockBody hpp={state.data} />;
}
