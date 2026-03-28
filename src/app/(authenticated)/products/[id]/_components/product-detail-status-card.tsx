"use client";

import { ProductStatusCard } from "@/app/(authenticated)/products/_components/product-status-card";
import { useProductDetail } from "@/app/(authenticated)/products/[id]/_providers/product-detail-provider";

export function ProductDetailStatusCard() {
  const { form } = useProductDetail();

  return <ProductStatusCard status={form.status} onStatusChange={form.setStatus} />;
}
