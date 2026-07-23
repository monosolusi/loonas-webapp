"use client";

import { ListPageHeader } from "@/core/presentations/components/list-page-header";
import { PeriodsProvider } from "@/app/(authenticated)/accounting/periods/_providers/periods-provider";
import { PeriodsList } from "@/app/(authenticated)/accounting/periods/_components/periods-list";
import { ClosePeriodDialog } from "@/app/(authenticated)/accounting/periods/_components/close-period-dialog";
import { ReopenPeriodDialog } from "@/app/(authenticated)/accounting/periods/_components/reopen-period-dialog";
import { YearEndPanel } from "@/app/(authenticated)/accounting/periods/_components/year-end-panel";
import { CloseYearDialog } from "@/app/(authenticated)/accounting/periods/_components/close-year-dialog";
import { ReopenYearDialog } from "@/app/(authenticated)/accounting/periods/_components/reopen-year-dialog";

export default function PeriodsPage() {
  return (
    <div className="flex flex-col gap-y-6">
      <ListPageHeader title="Periode Akuntansi" />
      <PeriodsProvider>
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[1fr_360px]">
          <div className="flex flex-col gap-y-4">
            <PeriodsList />
            <ClosePeriodDialog />
            <ReopenPeriodDialog />
          </div>
          <div className="flex flex-col gap-y-4">
            <YearEndPanel />
            <CloseYearDialog />
            <ReopenYearDialog />
          </div>
        </div>
      </PeriodsProvider>
    </div>
  );
}
