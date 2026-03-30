"use client";

import { ProductStatusCard } from "@/app/(authenticated)/products/_components/product-status-card";
import { useProductCreate } from "@/app/(authenticated)/products/create/_providers/product-create-provider";

export function ProductCreateStatusCard() {
  const { form } = useProductCreate();

  return <ProductStatusCard active={form.active} onActiveChange={form.setActive} />;
}
