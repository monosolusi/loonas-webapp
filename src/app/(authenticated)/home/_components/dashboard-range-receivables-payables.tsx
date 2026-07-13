"use client";

import { useMemo } from "react";
import { mutate } from "swr";
import { SectionCard } from "@/core/presentations/components/section-card";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { useGetDashboardStatistics } from "@/features/dashboard/presentations/hooks/use-get-dashboard-statistics";
import { useDashboardRange } from "@/app/(authenticated)/home/_providers/dashboard-range-provider";
import { DashboardRangeReceivablesPayablesLoading } from "@/app/(authenticated)/home/_components/dashboard-range-receivables-payables-loading";
import { DashboardRangeReceivablesPayablesEmpty } from "@/app/(authenticated)/home/_components/dashboard-range-receivables-payables-empty";
import { DashboardRangeReceivablesPayablesError } from "@/app/(authenticated)/home/_components/dashboard-range-receivables-payables-error";
import { DASHBOARD_SWR_KEYS } from "@/features/dashboard/presentations/constants/swr-keys";

type BalanceRowProps = {
  label: string;
  hint: string;
  amount: number;
  count: number;
};

function BalanceRow({ label, hint, amount, count }: BalanceRowProps) {
  return (
    <div className="flex items-start justify-between gap-x-4">
      <div className="flex flex-col gap-y-0.5">
        <span className="text-sm font-medium text-neutral-400">{label}</span>
        <span className="text-xs text-neutral-300">
          {hint} · {count} tagihan
        </span>
      </div>
      <span className="text-base font-semibold text-neutral-500">
        <NumberDisplay value={amount} prefix="Rp" />
      </span>
    </div>
  );
}

export function DashboardRangeReceivablesPayables() {
  const { from, to } = useDashboardRange();
  const result = useGetDashboardStatistics({ from, to });

  const balances = useMemo(() => {
    if (result.loading || result.error || !result.statistics) return null;
    const { piutang, hutang } = result.statistics;
    return { piutang, hutang };
  }, [result]);

  if (result.loading) return <DashboardRangeReceivablesPayablesLoading />;
  if (result.error) {
    return (
      <DashboardRangeReceivablesPayablesError
        onRetry={() => mutate((key) => Array.isArray(key) && key[0] === DASHBOARD_SWR_KEYS.DASHBOARD_STATISTICS)}
      />
    );
  }
  if (!balances || (balances.piutang.amount === 0 && balances.hutang.amount === 0)) {
    return <DashboardRangeReceivablesPayablesEmpty />;
  }

  return (
    <SectionCard title="Piutang & Hutang">
      <div className="flex flex-col gap-y-4">
        <BalanceRow
          label="Piutang"
          hint="akan diterima dari pelanggan"
          amount={balances.piutang.amount}
          count={balances.piutang.count}
        />
        <div className="border-t border-neutral-100" />
        <BalanceRow
          label="Hutang"
          hint="akan dibayar ke pemasok"
          amount={balances.hutang.amount}
          count={balances.hutang.count}
        />
      </div>
    </SectionCard>
  );
}
