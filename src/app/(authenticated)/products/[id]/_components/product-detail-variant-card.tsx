"use client";

import { ProductType } from "@/features/product/domain/enums/product-type";
import { ProductVariantCard } from "@/app/(authenticated)/products/_components/product-variant-card";
import { useProductDetail } from "@/app/(authenticated)/products/[id]/_providers/product-detail-provider";

export function ProductDetailVariantCard() {
  const { form } = useProductDetail();

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
