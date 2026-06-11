"use client";

import { ChevronRightIcon } from "@heroicons/react/16/solid";
import { PriceRangeDisplay } from "@/core/presentations/components/price-range-display";
import { ProductForSaleEntity } from "@/features/product/domain/entities/product-for-sale";
import { ProductListRow } from "@/app/(pos)/pos/_components/product-list-row";
import { StockHint } from "@/app/(pos)/pos/_components/stock-hint";
import { UnavailableBadge } from "@/app/(pos)/pos/_components/unavailable-badge";

type ProductPickerRowProps = {
  product: ProductForSaleEntity;
  active: boolean;
  onClick: () => void;
};

export function ProductPickerRow({ product, active, onClick }: ProductPickerRowProps) {
  const { min, max } = product.priceRange;
  const hasMultipleVariants = product.hasMultipleVariants;
  const totalCount = product.variants.length;
  const availableCount = product.variants.filter((v) => v.isAvailable).length;

  // No variants available → unavailable row, dimmed + badge.
  if (totalCount > 0 && !product.hasAvailableVariant) {
    const firstReason = product.variants[0].unavailableReason;
    return (
      <ProductListRow
        primaryLabel={product.name}
        disabled
        right={firstReason ? <UnavailableBadge reason={firstReason} /> : null}
        active={active}
        onClick={onClick}
      />
    );
  }

  // Single variant → show stock hint inline (variant.currentStock or maxMakeable).
  // Multi-variant with partial availability → show "n/N" fraction.
  const singleVariant = totalCount === 1 ? product.variants[0] : null;
  const partial = hasMultipleVariants && availableCount < totalCount;

  return (
    <ProductListRow
      primaryLabel={product.name}
      right={
        <>
          <PriceRangeDisplay min={min} max={max} />
          {singleVariant && (
            <StockHint available={singleVariant.currentStock ?? singleVariant.maxMakeable} />
          )}
          {partial && (
            <span className="text-xs text-neutral-300 tabular-nums">
              {availableCount}/{totalCount}
            </span>
          )}
          {hasMultipleVariants && <ChevronRightIcon className="size-4 text-neutral-200" />}
        </>
      }
      active={active}
      onClick={onClick}
    />
  );
}
