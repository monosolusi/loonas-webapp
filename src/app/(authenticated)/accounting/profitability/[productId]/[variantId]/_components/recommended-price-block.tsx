"use client";

import { RecommendedPriceBlockBody } from "@/app/(authenticated)/accounting/profitability/[productId]/[variantId]/_components/recommended-price-block-body";

// The recommended-price block manages its own margin state and re-requests.
// Body handles all internal states (loading, incomplete-recipe, error, success).
export function RecommendedPriceBlock() {
  return <RecommendedPriceBlockBody />;
}
