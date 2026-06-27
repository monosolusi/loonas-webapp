"use client";

import { useState } from "react";
import { SectionCard } from "@/core/presentations/components/section-card";
import { MarginControl } from "@/features/profitability/presentations/components/margin-control";
import { RecommendedPriceValueDisplay } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_components/recommended-price-value-display";
import { useProfitabilityDetail } from "@/app/(authenticated)/finance/profitability/[productId]/[variantId]/_providers/profitability-detail-provider";
import { useGetVariantRecommendedPrice } from "@/features/profitability/presentations/hooks/use-get-variant-recommended-price";

const DEFAULT_MARGIN = 30;

export function RecommendedPriceBlockBody() {
  const { productId, variantId } = useProfitabilityDetail();
  const [margin, setMargin] = useState(DEFAULT_MARGIN);

  const state = useGetVariantRecommendedPrice({ productId, variantId, margin });

  return (
    <SectionCard title="Rekomendasi Harga Jual">
      <div className="flex flex-col gap-y-2">
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-300">REKOMENDASI HARGA</span>
        <div aria-live="polite" className="flex min-h-10 flex-col gap-y-0.5">
          <RecommendedPriceValueDisplay state={state} />
          <span className="text-xs text-neutral-300">untuk target margin {margin}%</span>
        </div>
      </div>

      <div className="mt-6">
        <MarginControl value={margin} onChange={setMargin} loading={state.loading} />
      </div>

      <p className="mt-4 text-xs text-neutral-300">
        Rekomendasi harga berdasarkan HPP dan target margin yang Anda pilih.
      </p>
    </SectionCard>
  );
}
