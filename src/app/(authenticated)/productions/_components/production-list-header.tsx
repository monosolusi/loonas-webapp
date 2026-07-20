"use client";

import Image from "next/image";
import Link from "next/link";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { ListPageHeader } from "@/core/presentations/components/list-page-header";
import { useProductionList } from "@/app/(authenticated)/productions/_providers/production-list-provider";

export function ProductionListHeader() {
  const { meta } = useProductionList();

  return (
    <ListPageHeader
      title="Catatan Produksi"
      subtitle={meta ? `${meta.total} catatan` : "Memuat..."}
      action={
        <Link href="/productions/create" className="w-full sm:w-auto">
          <PrimaryButton
            label="Catat Produksi"
            leftIcon={<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="" width={16} height={16} />}
            className="w-full sm:w-auto"
          />
        </Link>
      }
    />
  );
}
