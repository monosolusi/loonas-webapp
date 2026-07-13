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
import { PaymentMethod } from "@/features/dashboard/domain/entities/payment-method-breakdown";

// Collected channels share the Lunas Blue tonal ramp (One Signal Rule) — differentiated by tone, never a
// second saturated hue, and always paired with a word label. UNPAID is handled separately as an
// outstanding-state slice (warning tint), not a payment channel.
const COLLECTED_METHODS: { method: Exclude<PaymentMethod, "UNPAID">; label: string; fillClass: string }[] = [
  { method: "CASH", label: "Tunai", fillClass: "bg-primary-400" },
  { method: "QRIS", label: "QRIS", fillClass: "bg-primary-300" },
  { method: "VIRTUAL_ACCOUNT", label: "Virtual Account", fillClass: "bg-primary-200" },
  { method: "CREDIT_CARD", label: "Kartu Kredit", fillClass: "bg-primary-100" },
];

type BreakdownRowProps = {
  label: string;
  hint?: string;
  amount: number;
  percentage: number;
  fillClass: string;
  trackClass?: string;
  labelClass?: string;
  ariaLabel: string;
};

function BreakdownRow({
  label,
  hint,
  amount,
  percentage,
  fillClass,
  trackClass = "bg-neutral-100",
  labelClass = "text-neutral-400",
  ariaLabel,
}: BreakdownRowProps) {
  return (
    <li className="flex flex-col gap-y-1.5">
      <div className="flex items-center justify-between gap-x-2">
        <span className="flex items-baseline gap-x-2">
          <span className={clsx("text-sm font-medium", labelClass)}>{label}</span>
          {hint && <span className="text-xs text-neutral-300">{hint}</span>}
        </span>
        <div className="flex items-center gap-x-2 text-sm text-neutral-400">
          <span>
            <NumberDisplay value={amount} prefix="Rp" />
          </span>
          <span className="text-neutral-300">({percentage}%)</span>
        </div>
      </div>
      {/* Dynamic continuous value — CSS var carve-out for the fill width */}
      <div
        className={clsx("h-2 w-full overflow-hidden rounded-full", trackClass)}
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

export function DashboardRangePaymentBreakdown() {
  const { from, to } = useDashboardRange();
  const result = useGetDashboardStatistics({ from, to });

  const breakdown = useMemo(() => {
    if (result.loading || result.error || !result.statistics) return null;
    const stats = result.statistics;
    // Reconcile against revenue.amount — the value the BE invariant sum(sales_breakdown) === revenue targets.
    const total = stats.revenue.amount;
    const amountByMethod = new Map<PaymentMethod, number>();
    for (const item of stats.salesBreakdown) {
      amountByMethod.set(item.method, (amountByMethod.get(item.method) ?? 0) + item.amount);
    }
    const toPct = (amount: number) => (total > 0 ? Math.round((amount / total) * 100) : 0);

    // Zero-row rule: hide collected methods with no transactions so a cash-only merchant isn't shown Rp 0 rows.
    const collected = COLLECTED_METHODS.map((config) => {
      const amount = amountByMethod.get(config.method) ?? 0;
      return { ...config, amount, percentage: toPct(amount) };
    }).filter((row) => row.amount > 0);

    const unpaidAmount = amountByMethod.get("UNPAID") ?? 0;
    const unpaid = unpaidAmount > 0 ? { amount: unpaidAmount, percentage: toPct(unpaidAmount) } : null;

    return { total, collected, unpaid };
  }, [result]);

  if (result.loading) return <DashboardRangePaymentBreakdownLoading />;
  if (result.error) {
    return (
      <DashboardRangePaymentBreakdownError
        onRetry={() => mutate((key) => Array.isArray(key) && key[0] === DASHBOARD_SWR_KEYS.DASHBOARD_STATISTICS)}
      />
    );
  }
  if (!breakdown || breakdown.total === 0) return <DashboardRangePaymentBreakdownEmpty />;

  return (
    <SectionCard title="Komposisi pendapatan">
      {breakdown.collected.length > 0 && (
        <ul className="flex flex-col gap-y-4" aria-label="Komposisi pendapatan menurut metode">
          {breakdown.collected.map((row) => (
            <BreakdownRow
              key={row.method}
              label={row.label}
              amount={row.amount}
              percentage={row.percentage}
              fillClass={row.fillClass}
              ariaLabel={`${row.label} ${row.percentage}%`}
            />
          ))}
        </ul>
      )}

      {breakdown.unpaid && (
        <ul
          className={clsx("border-t border-neutral-100 pt-4", breakdown.collected.length > 0 && "mt-4")}
          aria-label="Pendapatan belum diterima"
        >
          <BreakdownRow
            label="Belum dibayar"
            hint="tercatat, belum diterima"
            amount={breakdown.unpaid.amount}
            percentage={breakdown.unpaid.percentage}
            fillClass="bg-warning-300"
            trackClass="bg-warning-50"
            labelClass="text-warning-500"
            ariaLabel={`Belum dibayar ${breakdown.unpaid.percentage}%`}
          />
        </ul>
      )}

      <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
        <span className="text-sm font-semibold text-neutral-500">Total pendapatan</span>
        <span className="text-sm font-semibold text-neutral-500">
          <NumberDisplay value={breakdown.total} prefix="Rp" />
        </span>
      </div>
    </SectionCard>
  );
}
