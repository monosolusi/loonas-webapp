"use client";

import { ProductType } from "@/features/product/domain/enums/product-type";
import { ProductVariantCard } from "@/app/(authenticated)/products/_components/product-variant-card";
import { useProductCreate } from "@/app/(authenticated)/products/create/_providers/product-create-provider";

export function ProductCreateVariantCard() {
  const { form } = useProductCreate();

  return (
    <ProductVariantCard
      hasVariants={form.type !== ProductType.SERVICE && form.hasVariants}
      singlePrice={form.singlePrice}
      variants={form.variants}
      onHasVariantsChange={form.setHasVariants}
      onSinglePriceChange={form.setSinglePrice}
      onVariantsChange={form.setVariants}
      hideVariantToggle={form.type === ProductType.SERVICE}
    />
  );
}
