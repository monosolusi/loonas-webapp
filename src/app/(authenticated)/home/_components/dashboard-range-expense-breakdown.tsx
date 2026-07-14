"use client";

import { useMemo } from "react";
import clsx from "clsx";
import { mutate } from "swr";
import { SectionCard } from "@/core/presentations/components/section-card";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { useGetDashboardStatistics } from "@/features/dashboard/presentations/hooks/use-get-dashboard-statistics";
import { useDashboardRange } from "@/app/(authenticated)/home/_providers/dashboard-range-provider";
import { DashboardRangeExpenseBreakdownLoading } from "@/app/(authenticated)/home/_components/dashboard-range-expense-breakdown-loading";
import { DashboardRangeExpenseBreakdownEmpty } from "@/app/(authenticated)/home/_components/dashboard-range-expense-breakdown-empty";
import { DashboardRangeExpenseBreakdownError } from "@/app/(authenticated)/home/_components/dashboard-range-expense-breakdown-error";
import { DASHBOARD_SWR_KEYS } from "@/features/dashboard/presentations/constants/swr-keys";
import { ExpenseCategory } from "@/features/dashboard/domain/entities/beban-breakdown";

// Expense categories share a calm neutral (monochrome) ramp — differentiated by tone, never a second
// saturated hue. Blue stays reserved for the revenue composition (One Signal Rule); outflow reads grey.
const EXPENSE_CATEGORIES: { category: ExpenseCategory; label: string; fillClass: string }[] = [
  { category: "hpp", label: "HPP", fillClass: "bg-neutral-400" },
  { category: "biaya_operasional", label: "Biaya operasional", fillClass: "bg-neutral-300" },
  { category: "beban_lain_lain", label: "Beban lain-lain", fillClass: "bg-neutral-200" },
];

type BreakdownRowProps = {
  label: string;
  amount: number;
  percentage: number;
  fillClass: string;
  ariaLabel: string;
};

function BreakdownRow({ label, amount, percentage, fillClass, ariaLabel }: BreakdownRowProps) {
  return (
    <li className="flex flex-col gap-y-1.5">
      <div className="flex items-center justify-between gap-x-2">
        <span className="text-sm font-medium text-neutral-400">{label}</span>
        <div className="flex items-center gap-x-2 text-sm text-neutral-400">
          <span>
            <NumberDisplay value={amount} prefix="Rp" />
          </span>
          <span className="text-neutral-300">({percentage}%)</span>
        </div>
      </div>
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-neutral-100"
        style={{ "--bar-w": `${percentage}%` } as React.CSSProperties}
      >
        <div
          className={clsx(
            "h-2 w-[var(--bar-w)] rounded-full transition-all duration-500 motion-reduce:transition-none",
            fillClass,
          )}
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

export function DashboardRangeExpenseBreakdown() {
  const { from, to } = useDashboardRange();
  const result = useGetDashboardStatistics({ from, to });

  const breakdown = useMemo(() => {
    if (result.loading || result.error || !result.statistics) return null;
    const stats = result.statistics;
    // Reconcile against beban.amount — the value the BE invariant sum(beban_breakdown) === beban targets.
    const total = stats.beban.amount;
    const amountByCategory = new Map<ExpenseCategory, number>();
    for (const item of stats.bebanBreakdown) {
      amountByCategory.set(item.category, (amountByCategory.get(item.category) ?? 0) + item.amount);
    }
    const toPct = (amount: number) => (total > 0 ? Math.round((amount / total) * 100) : 0);

    // Zero-row rule: hide categories with no expense so a lean period isn't padded with Rp 0 rows.
    const rows = EXPENSE_CATEGORIES.map((config) => {
      const amount = amountByCategory.get(config.category) ?? 0;
      return { ...config, amount, percentage: toPct(amount) };
    }).filter((row) => row.amount > 0);

    return { total, rows };
  }, [result]);

  if (result.loading) return <DashboardRangeExpenseBreakdownLoading />;
  if (result.error) {
    return (
      <DashboardRangeExpenseBreakdownError
        onRetry={() => mutate((key) => Array.isArray(key) && key[0] === DASHBOARD_SWR_KEYS.DASHBOARD_STATISTICS)}
      />
    );
  }
  if (!breakdown || breakdown.total === 0) return <DashboardRangeExpenseBreakdownEmpty />;

  return (
    <SectionCard title="Komposisi beban">
      {breakdown.rows.length > 0 && (
        <ul className="flex flex-col gap-y-4" aria-label="Komposisi beban menurut kategori">
          {breakdown.rows.map((row) => (
            <BreakdownRow
              key={row.category}
              label={row.label}
              amount={row.amount}
              percentage={row.percentage}
              fillClass={row.fillClass}
              ariaLabel={`${row.label} ${row.percentage}%`}
            />
          ))}
        </ul>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
        <span className="text-sm font-semibold text-neutral-500">Total beban</span>
        <span className="text-sm font-semibold text-neutral-500">
          <NumberDisplay value={breakdown.total} prefix="Rp" />
        </span>
      </div>
    </SectionCard>
  );
}
