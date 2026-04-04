"use client";

import { useProductList } from "@/app/(authenticated)/products/_providers/product-list-provider";

export function ProductListHeader() {
  const { meta } = useProductList();

  return (
    <div className="flex flex-col gap-y-2">
      <h1 className="text-3xl leading-9 font-bold tracking-tight">Produk</h1>
      <p className="leading-6 text-neutral-300">{meta ? `${meta.total} produk` : "Memuat..."}</p>
    </div>
  );
}
