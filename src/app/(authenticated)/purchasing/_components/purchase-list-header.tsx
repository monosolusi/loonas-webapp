"use client";

import Image from "next/image";
import Link from "next/link";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { usePurchaseList } from "@/app/(authenticated)/purchasing/_providers/purchase-list-provider";

export function PurchaseListHeader() {
  const { meta } = usePurchaseList();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-3xl leading-9 font-bold tracking-tight">Pembelian</h1>
        <p className="leading-6 text-neutral-300">{meta ? `${meta.total} pembelian` : "Memuat..."}</p>
      </div>
      <Link href="/purchasing/create" className="w-full sm:w-auto">
        <PrimaryButton
          label="Catat Pembelian"
          leftIcon={<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="" width={16} height={16} />}
          className="w-full sm:w-auto"
        />
      </Link>
    </div>
  );
}
