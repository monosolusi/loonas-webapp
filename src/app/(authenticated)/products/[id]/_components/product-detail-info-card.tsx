"use client";

import { ProductInfoCard } from "@/app/(authenticated)/products/_components/product-info-card";
import { useProductDetail } from "@/app/(authenticated)/products/[id]/_providers/product-detail-provider";

export function ProductDetailInfoCard() {
  const { form } = useProductDetail();

  return <ProductInfoCard name={form.name} sku={form.sku} onNameChange={form.setName} onSkuChange={form.setSku} />;
}
