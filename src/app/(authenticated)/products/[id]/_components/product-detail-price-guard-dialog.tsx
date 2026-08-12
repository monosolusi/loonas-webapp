"use client";

import { VariantPriceGuardDialog } from "@/app/(authenticated)/products/_components/variant-price-guard-dialog";
import { useProductDetail } from "@/app/(authenticated)/products/[id]/_providers/product-detail-provider";

export function ProductDetailPriceGuardDialog() {
  const { priceGuardRejection, dismissPriceGuard } = useProductDetail();

  return (
    <VariantPriceGuardDialog
      open={!!priceGuardRejection}
      offendingTiers={priceGuardRejection?.offendingTiers ?? []}
      newPrice={priceGuardRejection?.newPrice ?? null}
      onClose={dismissPriceGuard}
    />
  );
}
