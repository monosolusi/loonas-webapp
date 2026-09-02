"use client";

import { SectionCard } from "@/core/presentations/components/section-card";
import { useGetBalance } from "@/features/balance/presentations/hooks/use-get-balance";
import { formatMoney } from "@/features/balance/domain/helpers/format-money";
import { BalanceSummaryError } from "@/app/(authenticated)/balance/_components/balance-summary-error";

export function BalanceSummaryCard() {
  const { balance, loading, error, refresh } = useGetBalance();

  if (loading) {
    return (
      <SectionCard title="Saldo Saat Ini">
        <div className="h-8 w-40 animate-pulse rounded bg-neutral-100" />
      </SectionCard>
    );
  }

  if (error !== null) {
    return <BalanceSummaryError onRetry={() => void refresh().catch(() => {})} />;
  }

  return (
    <SectionCard title="Saldo Saat Ini">
      <span className="text-2xl leading-8 font-bold text-neutral-500">
        {formatMoney(balance.balance, balance.currency)}
      </span>
    </SectionCard>
  );
}
