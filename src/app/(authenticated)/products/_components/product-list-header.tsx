"use client";

import { ListPageHeader } from "@/core/presentations/components/list-page-header";
import { useProductList } from "@/app/(authenticated)/products/_providers/product-list-provider";

export function ProductListHeader() {
  const { meta } = useProductList();

  return <ListPageHeader title="Produk" subtitle={meta ? `${meta.total} produk` : "Memuat..."} />;
}
