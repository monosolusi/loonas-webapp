"use client";

import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { useProductDetail } from "@/app/(authenticated)/products/[id]/_providers/product-detail-provider";

export function ProductDetailHeader() {
  const { product } = useProductDetail();

  if (!product) return null;

  return <DetailPageHeader backHref="/products" title={product.name} subtitle={`SKU: ${product.sku}`} />;
}
