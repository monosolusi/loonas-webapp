"use client";

import { PeriodsProvider } from "@/app/(authenticated)/finance/periods/_providers/periods-provider";
import { PeriodsList } from "@/app/(authenticated)/finance/periods/_components/periods-list";
import { ClosePeriodDialog } from "@/app/(authenticated)/finance/periods/_components/close-period-dialog";
import { ReopenPeriodDialog } from "@/app/(authenticated)/finance/periods/_components/reopen-period-dialog";
import { YearEndPanel } from "@/app/(authenticated)/finance/periods/_components/year-end-panel";
import { CloseYearDialog } from "@/app/(authenticated)/finance/periods/_components/close-year-dialog";
import { ReopenYearDialog } from "@/app/(authenticated)/finance/periods/_components/reopen-year-dialog";

export default function PeriodsPage() {
  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-3xl leading-9 font-bold tracking-tight">Periode Akuntansi</h1>
      </div>
      <PeriodsProvider>
        <PeriodsList />
        <ClosePeriodDialog />
        <ReopenPeriodDialog />
        <YearEndPanel />
        <CloseYearDialog />
        <ReopenYearDialog />
      </PeriodsProvider>
    </div>
  );
}
