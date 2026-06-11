"use client";

import { ProductCategoryCard } from "@/app/(authenticated)/products/_components/product-category-card";
import { useProductCreate } from "@/app/(authenticated)/products/create/_providers/product-create-provider";

export function ProductCreateCategoryCard() {
  const { form } = useProductCreate();

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
