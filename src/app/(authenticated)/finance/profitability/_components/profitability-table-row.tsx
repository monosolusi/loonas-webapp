"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { ProductEntity } from "@/features/product/domain/entities/product";
import { VariantEntity } from "@/features/product/domain/entities/variant";
import { useGetVariantHpp } from "@/features/profitability/presentations/hooks/use-get-variant-hpp";
import { useGetVariantGrossProfit } from "@/features/profitability/presentations/hooks/use-get-variant-gross-profit";
import { useGetVariantRecommendedPrice } from "@/features/profitability/presentations/hooks/use-get-variant-recommended-price";
import { ProfitabilityTableRowLoading } from "@/app/(authenticated)/finance/profitability/_components/profitability-table-row-loading";
import { ProfitabilityTableRowData } from "@/app/(authenticated)/finance/profitability/_components/profitability-table-row-data";
import { useProfitabilityDashboard } from "@/app/(authenticated)/finance/profitability/_providers/profitability-dashboard-provider";

const DEFAULT_MARGIN = 30;

type ProfitabilityTableRowProps = {
  product: ProductEntity;
  variant: VariantEntity;
};

export function ProfitabilityTableRow({ product, variant }: ProfitabilityTableRowProps) {
  const router = useRouter();
  const { registerVariantGrossProfitState, unregisterVariantGrossProfitState } = useProfitabilityDashboard();

  const hppState = useGetVariantHpp({ productId: product.id, variantId: variant.id });
  const grossProfitState = useGetVariantGrossProfit({ productId: product.id, variantId: variant.id });
  const recPriceState = useGetVariantRecommendedPrice({
    productId: product.id,
    variantId: variant.id,
    margin: DEFAULT_MARGIN,
  });

  const variantKey = useMemo(
    () => `${product.id}::${variant.id}`,
    [product.id, variant.id],
  );

  useEffect(() => {
    registerVariantGrossProfitState(variantKey, grossProfitState);
    return () => {
      unregisterVariantGrossProfitState(variantKey);
    };
  }, [
    variantKey,
    grossProfitState.data,
    grossProfitState.loading,
    grossProfitState.error,
    grossProfitState.isIncompleteRecipe,
    registerVariantGrossProfitState,
    unregisterVariantGrossProfitState,
  ]);

  const isLoading = hppState.loading || grossProfitState.loading || recPriceState.loading;

  function handleClick() {
    router.push(`/finance/profitability/${product.id}/${variant.id}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  }

  return (
    <div
      role="row"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={clsx(
        "group grid cursor-pointer items-center border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-3 transition-colors hover:border-l-primary-300 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300",
        "[grid-template-columns:var(--grid-profitability-cols)]",
      )}
      aria-label={`Lihat detail profitabilitas ${product.name} — ${variant.name}`}
    >
      <div className="flex min-w-0 flex-col gap-y-0.5 pr-4">
        <span
          className="truncate text-sm font-medium text-neutral-500 transition-colors group-hover:text-primary-400"
          title={product.name}
        >
          {product.name}
        </span>
        <span className="truncate text-xs text-neutral-300" title={variant.name}>
          {variant.name}
        </span>
      </div>

      {isLoading ? (
        <ProfitabilityTableRowLoading />
      ) : (
        <ProfitabilityTableRowData
          hpp={hppState.data}
          hppIncomplete={hppState.isIncompleteRecipe}
          grossProfit={grossProfitState.data}
          grossProfitIncomplete={grossProfitState.isIncompleteRecipe}
          recommendedPrice={recPriceState.data}
          variantPrice={variant.price}
        />
      )}
    </div>
  );
}
