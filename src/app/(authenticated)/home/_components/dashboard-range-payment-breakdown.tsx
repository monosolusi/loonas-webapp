"use client";

import { useMemo } from "react";
import clsx from "clsx";
import { mutate } from "swr";
import { SectionCard } from "@/core/presentations/components/section-card";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { useGetDashboardStatistics } from "@/features/dashboard/presentations/hooks/use-get-dashboard-statistics";
import { useDashboardRange } from "@/app/(authenticated)/home/_providers/dashboard-range-provider";
import { DashboardRangePaymentBreakdownLoading } from "@/app/(authenticated)/home/_components/dashboard-range-payment-breakdown-loading";
import { DashboardRangePaymentBreakdownEmpty } from "@/app/(authenticated)/home/_components/dashboard-range-payment-breakdown-empty";
import { DashboardRangePaymentBreakdownError } from "@/app/(authenticated)/home/_components/dashboard-range-payment-breakdown-error";
import { DASHBOARD_SWR_KEYS } from "@/features/dashboard/presentations/constants/swr-keys";

type BreakdownRowProps = {
  label: string;
  amount: number;
  percentage: number;
  fillClass: string;
  ariaLabel: string;
};

function BreakdownRow({ label, amount, percentage, fillClass, ariaLabel }: BreakdownRowProps) {
  return (
    <li role="listitem" className="flex flex-col gap-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-neutral-400">{label}</span>
        <div className="flex items-center gap-x-2 text-sm text-neutral-400">
          <span>
            <NumberDisplay value={amount} prefix="Rp" />
          </span>
          <span className="text-neutral-200">({percentage}%)</span>
        </div>
      </div>
      {/* Dynamic continuous value — CSS var carve-out per Rule 13 */}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-neutral-100"
        style={{ "--bar-w": `${percentage}%` } as React.CSSProperties}
      >
        <div
          className={clsx("h-2 w-[var(--bar-w)] rounded-full transition-all duration-500", fillClass)}
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={ariaLabel}
        />
      </div>
    </li>
  );
}

export function DashboardRangePaymentBreakdown() {
  const { from, to } = useDashboardRange();
  const result = useGetDashboardStatistics({ from, to });

  const breakdown = useMemo(() => {
    if (result.loading || result.error || !result.statistics) return null;
    const items = result.statistics.salesBreakdown;
    const cashItem = items.find((i) => i.method === "CASH");
    const qrisItem = items.find((i) => i.method === "QRIS");
    const cashAmount = cashItem?.amount ?? 0;
    const qrisAmount = qrisItem?.amount ?? 0;
    const total = cashAmount + qrisAmount;
    const cashPct = total > 0 ? Math.round((cashAmount / total) * 100) : 0;
    const qrisPct = total > 0 ? 100 - cashPct : 0;
    return { cashAmount, qrisAmount, cashPct, qrisPct, total };
  }, [result]);

  if (result.loading) return <DashboardRangePaymentBreakdownLoading />;
  if (result.error) {
    return (
      <DashboardRangePaymentBreakdownError
        onRetry={() => mutate([DASHBOARD_SWR_KEYS.DASHBOARD_STATISTICS, from, to])}
      />
    );
  }
  if (!breakdown || breakdown.total === 0) return <DashboardRangePaymentBreakdownEmpty />;

  return (
    <SectionCard title="Metode pembayaran">
      <ul className="flex flex-col gap-y-4" aria-label="Rincian metode pembayaran">
        <BreakdownRow
          label="Tunai"
          amount={breakdown.cashAmount}
          percentage={breakdown.cashPct}
          fillClass="bg-success-300"
          ariaLabel={`Tunai ${breakdown.cashPct}%`}
        />
        <BreakdownRow
          label="QRIS"
          amount={breakdown.qrisAmount}
          percentage={breakdown.qrisPct}
          fillClass="bg-primary-300"
          ariaLabel={`QRIS ${breakdown.qrisPct}%`}
        />
      </ul>
    </SectionCard>
  );
}
