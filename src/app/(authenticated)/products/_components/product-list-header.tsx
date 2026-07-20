"use client";

import Image from "next/image";
import Link from "next/link";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { ListPageHeader } from "@/core/presentations/components/list-page-header";
import { useProductList } from "@/app/(authenticated)/products/_providers/product-list-provider";

export function ProductListHeader() {
  const { meta } = useProductList();

  return (
    <ListPageHeader
      title="Produk"
      subtitle={meta ? `${meta.total} produk` : "Memuat..."}
      action={
        <Link href="/products/create" className="w-full sm:w-auto">
          <PrimaryButton
            label="Tambah Produk"
            leftIcon={<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="" width={16} height={16} />}
            className="w-full sm:w-auto"
          />
        </Link>
      }
    />
  );
}
