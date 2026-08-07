"use client";

import { NumberDisplay } from "@/core/presentations/components/number-display";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { VariantForSaleEntity } from "@/features/product/domain/entities/variant-for-sale";
import { ProductListRow } from "@/app/(pos)/pos/_components/product-list-row";
import { StockHint } from "@/app/(pos)/pos/_components/stock-hint";
import { UnavailableBadge } from "@/app/(pos)/pos/_components/unavailable-badge";
import { OutOfStockBadge } from "@/app/(pos)/pos/_components/out-of-stock-badge";
import { VariantTierSummary } from "@/app/(pos)/pos/_components/variant-tier-summary";

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
  const hasTiers = variant.priceTierSchedule?.hasTiers ?? false;

  return (
    <ProductListRow
      primaryLabel={variant.name}
      secondary={<VariantTierSummary schedule={variant.priceTierSchedule} />}
      right={
        <>
          {/* StatusChip renders a span; Chip renders a button and would nest inside this row's button. */}
          {hasTiers && <StatusChip label="Grosir" variant="primary" compact />}
          <OutOfStockBadge isOutOfStock={variant.isOutOfStock} />
          <NumberDisplay value={variant.price} />
          <StockHint available={stockSource} />
        </>
      }
      active={active}
      onClick={onClick}
    />
  );
}
