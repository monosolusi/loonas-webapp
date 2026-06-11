"use client";

import { NumberDisplay } from "@/core/presentations/components/number-display";
import { VariantForSaleEntity } from "@/features/product/domain/entities/variant-for-sale";
import { ProductListRow } from "@/app/(pos)/pos/_components/product-list-row";
import { StockHint } from "@/app/(pos)/pos/_components/stock-hint";
import { UnavailableBadge } from "@/app/(pos)/pos/_components/unavailable-badge";

type ProductPickerVariantRowProps = {
  variant: VariantForSaleEntity;
  active: boolean;
  onClick: () => void;
};

export function ProductPickerVariantRow({ variant, active, onClick }: ProductPickerVariantRowProps) {
  if (!variant.isAvailable) {
    return (
      <ProductListRow
        primaryLabel={variant.name}
        disabled
        right={variant.unavailableReason ? <UnavailableBadge reason={variant.unavailableReason} /> : null}
        active={active}
        onClick={onClick}
      />
    );
  }

  const stockSource = variant.currentStock ?? variant.maxMakeable;

  return (
    <ProductListRow
      primaryLabel={variant.name}
      right={
        <>
          <NumberDisplay value={variant.price} />
          <StockHint available={stockSource} />
        </>
      }
      active={active}
      onClick={onClick}
    />
  );
}
