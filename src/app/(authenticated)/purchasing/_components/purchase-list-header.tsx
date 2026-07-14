"use client";

import Image from "next/image";
import Link from "next/link";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { ListPageHeader } from "@/core/presentations/components/list-page-header";
import { usePurchaseList } from "@/app/(authenticated)/purchasing/_providers/purchase-list-provider";

export function PurchaseListHeader() {
  const { meta } = usePurchaseList();

  return (
    <ListPageHeader
      title="Pembelian"
      subtitle={meta ? `${meta.total} pembelian` : "Memuat..."}
      action={
        <Link href="/purchasing/create" className="w-full sm:w-auto">
          <PrimaryButton
            label="Catat Pembelian"
            leftIcon={<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="" width={16} height={16} />}
            className="w-full sm:w-auto"
          />
        </Link>
      }
    />
  );
}
