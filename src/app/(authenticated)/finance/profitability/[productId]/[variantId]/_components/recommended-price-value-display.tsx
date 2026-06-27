"use client";

import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { UseGetVariantRecommendedPriceReturnType } from "@/features/profitability/presentations/hooks/use-get-variant-recommended-price.types";

type RecommendedPriceValueDisplayProps = {
  state: UseGetVariantRecommendedPriceReturnType;
};

export function RecommendedPriceValueDisplay({ state }: RecommendedPriceValueDisplayProps) {
  if (state.loading) {
    return <div className="h-8 w-40 animate-pulse rounded bg-neutral-100" />;
  }

  if (state.error) {
    return (
      <div className="flex items-center gap-x-1.5">
        <span className="text-sm text-neutral-300">—</span>
        <ExclamationCircleIcon className="size-3 text-error-500" />
        <span className="text-xs text-error-500">Gagal memuat rekomendasi harga. Coba ubah margin kembali.</span>
      </div>
    );
  }

  if (!state.data) {
    return null;
  }

  return (
    <span className="text-2xl font-bold text-neutral-500">
      {IDRFormatter.toCurrency(state.data.recommendedPrice)}
    </span>
  );
}
