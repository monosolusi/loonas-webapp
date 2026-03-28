"use client";

import { ProductInfoCard } from "@/app/(authenticated)/products/_components/product-info-card";
import { useProductCreate } from "@/app/(authenticated)/products/create/_providers/product-create-provider";

export function ProductCreateInfoCard() {
  const { form } = useProductCreate();

  return <ProductInfoCard name={form.name} sku={form.sku} onNameChange={form.setName} onSkuChange={form.setSku} />;
}
