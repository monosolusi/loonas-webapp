"use client";

import Link from "next/link";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { AccountingPeriodEntity } from "@/features/accounting/domain/entities/accounting-period";
import { usePeriods } from "@/app/(authenticated)/finance/periods/_providers/periods-provider";

type PeriodAllocationPanelEmptyProps = {
  period: AccountingPeriodEntity;
};

export function PeriodAllocationPanelEmpty({ period }: PeriodAllocationPanelEmptyProps) {
  const { openAllocateDialog } = usePeriods();

  return (
    <div className="border-b border-neutral-100 bg-neutral-50 px-6 py-6">
      <p className="text-sm font-medium text-neutral-500">Alokasi biaya tetap belum dilakukan</p>
      <p className="mt-1 text-sm text-neutral-400">
        Belum ada biaya tetap dikategorikan Produksi, atau alokasi belum dijalankan untuk periode ini.{" "}
        <Link href="/settings/fixed-costs" className="text-primary-400 underline hover:text-primary-500">
          Atur kategori biaya tetap
        </Link>{" "}
        lalu kembali ke sini untuk mengalokasikan.
      </p>
      <div className="mt-4">
        <PrimaryButton
          label="Alokasikan biaya tetap"
          onClick={() => openAllocateDialog(period)}
          className="w-auto px-6"
        />
      </div>
    </div>
  );
}
