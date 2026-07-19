"use client";

import Image from "next/image";
import Link from "next/link";
import { ListPageHeader } from "@/core/presentations/components/list-page-header";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useFixedCostEntries } from "@/app/(authenticated)/accounting/fixed-costs/_providers/fixed-cost-entries-provider";

export function FixedCostHeader() {
  const { masterCount, loading } = useFixedCostEntries();

  return (
    <ListPageHeader
      title="Biaya Tetap Bulanan"
      subtitle={loading && masterCount === 0 ? "Memuat..." : `${masterCount} jenis biaya`}
      action={
        <Link href="/accounting/fixed-cost-types" className="w-full sm:w-auto">
          <PrimaryButton
            label="Tambah Biaya Tetap"
            leftIcon={<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="" width={16} height={16} />}
            className="w-full sm:w-auto"
          />
        </Link>
      }
    />
  );
}
