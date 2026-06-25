"use client";

import { useProfitabilityDetail } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_providers/profitability-detail-provider";
import { useGetVariantHpp } from "@/features/profitability/presentations/hooks/use-get-variant-hpp";
import { HppBlockLoading } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_components/hpp-block-loading";
import { HppBlockIncomplete } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_components/hpp-block-incomplete";
import { HppBlockError } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_components/hpp-block-error";
import { HppBlockBody } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_components/hpp-block-body";

export function HppBlock() {
  const { productId, variantId } = useProfitabilityDetail();
  const state = useGetVariantHpp({ productId, variantId });
  const refresh = state.refresh;

  if (state.loading) return <HppBlockLoading />;
  if (state.isIncompleteRecipe) return <HppBlockIncomplete />;
  if (state.error) return <HppBlockError onRetry={() => { if (refresh) refresh(); }} />;
  return <HppBlockBody hpp={state.data} />;
}
