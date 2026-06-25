"use client";

import { useProfitabilityDetail } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_providers/profitability-detail-provider";
import { useGetVariantGrossProfit } from "@/features/profitability/presentations/hooks/use-get-variant-gross-profit";
import { GrossProfitBlockLoading } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_components/gross-profit-block-loading";
import { GrossProfitBlockNoPos } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_components/gross-profit-block-no-pos";
import { GrossProfitBlockIncomplete } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_components/gross-profit-block-incomplete";
import { GrossProfitBlockError } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_components/gross-profit-block-error";
import { GrossProfitBlockBody } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_components/gross-profit-block-body";

export function GrossProfitBlock() {
  const { productId, variantId } = useProfitabilityDetail();
  const state = useGetVariantGrossProfit({ productId, variantId });
  const refresh = state.refresh;

  // Branch order: loading → 422 (incomplete recipe) → error (non-422) → needs_data (no POS) → success
  if (state.loading) return <GrossProfitBlockLoading />;
  if (state.isIncompleteRecipe) return <GrossProfitBlockIncomplete productId={productId} />;
  if (state.error) return <GrossProfitBlockError onRetry={() => { if (refresh) refresh(); }} />;

  const { data } = state;
  if (data.needsData) {
    return <GrossProfitBlockNoPos />;
  }

  return <GrossProfitBlockBody grossProfit={data} />;
}
