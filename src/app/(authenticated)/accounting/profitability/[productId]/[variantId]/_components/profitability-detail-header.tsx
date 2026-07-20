"use client";

import { useMemo } from "react";
import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { useProfitabilityDetail } from "@/app/(authenticated)/accounting/profitability/[productId]/[variantId]/_providers/profitability-detail-provider";

export function ProfitabilityDetailHeader() {
  const { product, variant } = useProfitabilityDetail();

  const title = useMemo(
    () => (variant ? `${product.name} · ${variant.name}` : product.name),
    [product.name, variant?.name],
  );

  return (
    <DetailPageHeader
      backHref="/accounting/profitability"
      title={title}
      subtitle="Profitabilitas Varian"
    />
  );
}
