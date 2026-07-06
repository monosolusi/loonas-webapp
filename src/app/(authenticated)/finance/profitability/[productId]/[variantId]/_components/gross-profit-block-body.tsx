"use client";

import { useMemo } from "react";
import clsx from "clsx";
import { SectionCard } from "@/core/presentations/components/section-card";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { VariantGrossProfitEntity } from "@/features/profitability/domain/entities/variant-gross-profit";

type GrossProfitBlockBodyProps = {
  grossProfit: VariantGrossProfitEntity;
};

export function GrossProfitBlockBody({ grossProfit }: GrossProfitBlockBodyProps) {
  const { estimasiLabaKotor, inputs } = grossProfit;
  const isPositive = estimasiLabaKotor !== null && estimasiLabaKotor >= 0;
  const sign = estimasiLabaKotor !== null ? (estimasiLabaKotor >= 0 ? "+" : "−") : "";
  const absValue = estimasiLabaKotor !== null ? Math.abs(estimasiLabaKotor) : 0;

  const realizedMargin = useMemo(() => {
    if (!inputs || inputs.posRevenue <= 0 || estimasiLabaKotor === null) return null;
    return (estimasiLabaKotor / inputs.posRevenue) * 100;
  }, [inputs, estimasiLabaKotor]);

  return (
    <SectionCard title="Laba Kotor">
      <dl className="flex flex-col gap-y-3">
        {inputs && (
          <>
            <div className="flex flex-row justify-between">
              <dt className="text-sm text-neutral-500">Pendapatan (POS)</dt>
              <dd className="text-sm font-medium text-neutral-500">
                {IDRFormatter.toCurrency(inputs.posRevenue)}
              </dd>
            </div>
            <div className="border-t border-neutral-100" />
          </>
        )}

        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-y-0.5">
            <dt className="text-sm font-semibold text-neutral-500">Laba Kotor</dt>
            <dd
              aria-live="polite"
              className={clsx(
                "text-2xl font-bold",
                isPositive ? "text-success-500" : "text-error-500",
              )}
            >
              {estimasiLabaKotor !== null ? `${sign} ${IDRFormatter.toCurrency(absValue)}` : "—"}
            </dd>
          </div>
          {estimasiLabaKotor !== null && (
            <StatusChip
              variant={isPositive ? "success" : "error"}
              label={isPositive ? "Menguntungkan" : "Rugi"}
              compact
            />
          )}
        </div>

        <div className="flex flex-row justify-between">
          <dt className="text-sm text-neutral-500">Margin Realisasi</dt>
          <dd className="text-sm tabular-nums text-neutral-500">
            {realizedMargin !== null
              ? `${realizedMargin.toLocaleString("id-ID", { maximumFractionDigits: 1 })}%`
              : "—"}
          </dd>
        </div>
      </dl>

      <p className="mt-4 text-xs text-neutral-300">
        {inputs?.periodFrom && inputs?.periodTo
          ? `Berdasarkan penjualan POS pada periode ${inputs.periodFrom} – ${inputs.periodTo}.`
          : "Berdasarkan penjualan POS pada periode default."}
      </p>
    </SectionCard>
  );
}
