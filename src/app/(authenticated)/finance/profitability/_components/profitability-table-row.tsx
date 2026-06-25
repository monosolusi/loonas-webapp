"use client";

import { useRouter } from "next/navigation";
import { ProductEntity } from "@/features/product/domain/entities/product";
import { VariantEntity } from "@/features/product/domain/entities/variant";
import { useGetVariantHpp } from "@/features/profitability/presentations/hooks/use-get-variant-hpp";
import { useGetVariantGrossProfit } from "@/features/profitability/presentations/hooks/use-get-variant-gross-profit";
import { useGetVariantRecommendedPrice } from "@/features/profitability/presentations/hooks/use-get-variant-recommended-price";
import { ProfitabilityTableRowLoading } from "@/app/(authenticated)/finance/profitability/_components/profitability-table-row-loading";
import { ProfitabilityTableRowData } from "@/app/(authenticated)/finance/profitability/_components/profitability-table-row-data";

const DEFAULT_MARGIN = 30;

type ProfitabilityTableRowProps = {
  product: ProductEntity;
  variant: VariantEntity;
};

export function ProfitabilityTableRow({ product, variant }: ProfitabilityTableRowProps) {
  const router = useRouter();

  const hppState = useGetVariantHpp({ productId: product.id, variantId: variant.id });
  const grossProfitState = useGetVariantGrossProfit({ productId: product.id, variantId: variant.id });
  const recPriceState = useGetVariantRecommendedPrice({
    productId: product.id,
    variantId: variant.id,
    margin: DEFAULT_MARGIN,
  });

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
      className="grid cursor-pointer items-center border-b border-neutral-100 px-6 py-4 hover:bg-neutral-50/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 [grid-template-columns:var(--grid-profitability-cols)]"
      aria-label={`Lihat detail profitabilitas ${product.name} — ${variant.name}`}
    >
      <div className="flex flex-col gap-y-0.5 pr-4">
        <span className="truncate text-sm font-medium text-neutral-500" title={product.name}>
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
