"use client";

// Operating profit (Laba usaha) mini P&L for the selected period — sourced from GET /dashboard.
// `laba_usaha` = revenue.amount − beban.amount (before tax). Pajak (PPh Final) is shown as an
// informational footnote, NOT deducted here — the backend does not provide a net-after-tax figure,
// so we never invent one.

import { useMemo } from "react";
import clsx from "clsx";
import { mutate } from "swr";
import { SectionCard } from "@/core/presentations/components/section-card";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { useGetDashboardStatistics } from "@/features/dashboard/presentations/hooks/use-get-dashboard-statistics";
import { useDashboardRange } from "@/app/(authenticated)/home/_providers/dashboard-range-provider";
import { DashboardRangeOperatingProfitCardLoading } from "@/app/(authenticated)/home/_components/dashboard-range-operating-profit-card-loading";
import { DashboardRangeOperatingProfitCardEmpty } from "@/app/(authenticated)/home/_components/dashboard-range-operating-profit-card-empty";
import { DashboardRangeOperatingProfitCardError } from "@/app/(authenticated)/home/_components/dashboard-range-operating-profit-card-error";
import { DASHBOARD_SWR_KEYS } from "@/features/dashboard/presentations/constants/swr-keys";

type RegisterRowProps = {
  label: string;
  amount: number;
  deduction?: boolean;
};

function RegisterRow({ label, amount, deduction }: RegisterRowProps) {
  return (
    <div className="flex items-center justify-between gap-x-4">
      <span className="text-sm text-neutral-400">{label}</span>
      <span className="text-sm text-neutral-400">
        {deduction && "− "}
        <NumberDisplay value={amount} prefix="Rp" />
      </span>
    </div>
  );
}

export function DashboardRangeOperatingProfitCard() {
  const { from, to } = useDashboardRange();
  const result = useGetDashboardStatistics({ from, to });

  const summary = useMemo(() => {
    if (result.loading || result.error || !result.statistics) return null;
    const { revenue, beban } = result.statistics;
    return {
      revenue: revenue.amount,
      beban: beban.amount,
      labaUsaha: beban.labaUsaha,
      pajak: beban.pajak,
    };
  }, [result]);

  if (result.loading) return <DashboardRangeOperatingProfitCardLoading />;
  if (result.error) {
    return (
      <DashboardRangeOperatingProfitCardError
        onRetry={() => mutate((key) => Array.isArray(key) && key[0] === DASHBOARD_SWR_KEYS.DASHBOARD_STATISTICS)}
      />
    );
  }
  if (!summary || (summary.revenue === 0 && summary.beban === 0)) {
    return <DashboardRangeOperatingProfitCardEmpty />;
  }

  const isLoss = summary.labaUsaha < 0;

  return (
    <SectionCard title="Laba usaha">
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-col gap-y-3">
          <RegisterRow label="Pendapatan" amount={summary.revenue} />
          <RegisterRow label="Beban" amount={summary.beban} deduction />
        </div>

        <div className="flex items-center justify-between gap-x-4 border-t border-neutral-100 pt-4">
          <span className="text-sm font-semibold text-neutral-500">Laba usaha</span>
          <span className={clsx("text-xl font-bold tracking-tight", isLoss ? "text-error-500" : "text-success-500")}>
            {isLoss && "− "}
            <NumberDisplay value={Math.abs(summary.labaUsaha)} prefix="Rp" />
          </span>
        </div>

        <div className="flex items-start justify-between gap-x-4">
          <div className="flex flex-col gap-y-0.5">
            <span className="text-sm font-medium text-neutral-400">Pajak (PPh Final)</span>
            <span className="text-xs text-neutral-300">di luar laba usaha</span>
          </div>
          <span className="text-base font-semibold text-neutral-500">
            <NumberDisplay value={summary.pajak} prefix="Rp" />
          </span>
        </div>
      </div>
    </SectionCard>
  );
}
