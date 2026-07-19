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
  const { estimatedGrossProfit, inputs } = grossProfit;
  const isPositive = estimatedGrossProfit !== null && estimatedGrossProfit >= 0;
  const sign = estimatedGrossProfit !== null ? (estimatedGrossProfit >= 0 ? "+" : "−") : "";
  const absValue = estimatedGrossProfit !== null ? Math.abs(estimatedGrossProfit) : 0;

  const realizedMargin = useMemo(() => {
    if (!inputs || inputs.posRevenue <= 0 || estimatedGrossProfit === null) return null;
    return (estimatedGrossProfit / inputs.posRevenue) * 100;
  }, [inputs, estimatedGrossProfit]);

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

        <div className="flex flex-col items-start gap-y-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-y-0.5">
            <dt className="text-sm font-semibold text-neutral-500">Laba Kotor</dt>
            <dd
              aria-live="polite"
              className={clsx(
                "text-2xl font-bold",
                isPositive ? "text-success-500" : "text-error-500",
              )}
            >
              {estimatedGrossProfit !== null ? `${sign} ${IDRFormatter.toCurrency(absValue)}` : "—"}
            </dd>
          </div>
          {estimatedGrossProfit !== null && (
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
