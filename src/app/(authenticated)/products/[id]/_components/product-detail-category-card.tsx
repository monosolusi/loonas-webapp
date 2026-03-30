"use client";

import { ProductCategoryCard } from "@/app/(authenticated)/products/_components/product-category-card";
import { useProductDetail } from "@/app/(authenticated)/products/[id]/_providers/product-detail-provider";

export function ProductDetailCategoryCard() {
  const { form } = useProductDetail();

  return (
    <ProductCategoryCard
      type={form.type}
      productionMode={form.productionMode}
      categoryId={form.categoryId}
      onTypeChange={form.setType}
      onProductionModeChange={form.setProductionMode}
      onCategoryChange={form.setCategoryId}
    />
  );
}
