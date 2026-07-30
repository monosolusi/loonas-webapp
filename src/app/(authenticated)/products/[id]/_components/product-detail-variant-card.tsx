"use client";

import { useMemo } from "react";
import { ProductType } from "@/features/product/domain/enums/product-type";
import { ProductVariantCard } from "@/app/(authenticated)/products/_components/product-variant-card";
import { useProductDetail } from "@/app/(authenticated)/products/[id]/_providers/product-detail-provider";

export function ProductDetailVariantCard() {
  const { form, product } = useProductDetail();

  const defaultVariantSeed = useMemo(
    () =>
      product?.defaultVariant
        ? { key: product.defaultVariant.id, sku: product.defaultVariant.sku ?? "" }
        : undefined,
    [product],
  );

  return (
    <ProductVariantCard
      hasVariants={form.hasVariants}
      singlePrice={form.singlePrice}
      variants={form.variants}
      onHasVariantsChange={form.setHasVariants}
      onSinglePriceChange={form.setSinglePrice}
      onVariantsChange={form.setVariants}
      hideVariantToggle={form.type === ProductType.SERVICE}
      defaultVariantSeed={defaultVariantSeed}
    />
  );
}
