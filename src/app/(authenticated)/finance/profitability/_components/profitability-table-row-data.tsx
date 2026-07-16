"use client";

import { StatusChip } from "@/core/presentations/components/status-chip";
import { CurrencyDisplay } from "@/core/presentations/components/currency-display";
import { VariantCogsEntity } from "@/features/profitability/domain/entities/variant-cogs";
import { VariantGrossProfitEntity } from "@/features/profitability/domain/entities/variant-gross-profit";
import { VariantRecommendedPriceEntity } from "@/features/profitability/domain/entities/variant-recommended-price";

type ProfitabilityTableRowDataProps = {
  cogs: VariantCogsEntity | null;
  cogsIncomplete: boolean;
  grossProfit: VariantGrossProfitEntity | null;
  grossProfitIncomplete: boolean;
  recommendedPrice: VariantRecommendedPriceEntity | null;
  variantPrice: number;
};

function deriveStatusChip(
  cogsIncomplete: boolean,
  grossProfit: VariantGrossProfitEntity | null,
  grossProfitIncomplete: boolean,
): React.ReactNode {
  if (cogsIncomplete || grossProfitIncomplete) {
    return <StatusChip variant="warning" label="Kurang" compact />;
  }
  if (!grossProfit) return null;
  if (grossProfit.needsData) {
    return <StatusChip variant="neutral" label="Belum Jual" compact />;
  }
  if (grossProfit.estimatedGrossProfit === null) return null;
  if (grossProfit.estimatedGrossProfit < 0) {
    return <StatusChip variant="error" label="Rugi" compact />;
  }
  return <StatusChip variant="success" label="Untung" compact />;
}

export function ProfitabilityTableRowData({
  cogs,
  cogsIncomplete,
  grossProfit,
  grossProfitIncomplete,
  recommendedPrice,
  variantPrice,
}: ProfitabilityTableRowDataProps) {
  const cogsCell = cogs ? <CurrencyDisplay value={cogs.cogsPerUnit} /> : "—";
  const hargaJualCell = <CurrencyDisplay value={variantPrice} />;
  const recPriceCell = recommendedPrice ? <CurrencyDisplay value={recommendedPrice.recommendedPrice} /> : "—";

  const grossProfitPositive =
    grossProfit?.estimatedGrossProfit !== undefined &&
    grossProfit?.estimatedGrossProfit !== null &&
    grossProfit.estimatedGrossProfit >= 0 &&
    !grossProfit.needsData;

  const grossProfitNegative =
    grossProfit?.estimatedGrossProfit !== undefined &&
    grossProfit?.estimatedGrossProfit !== null &&
    grossProfit.estimatedGrossProfit < 0 &&
    !grossProfit.needsData;

  const grossProfitCell = (() => {
    if (grossProfitIncomplete) return "—";
    if (!grossProfit) return "—";
    if (grossProfit.needsData) return "—";
    if (grossProfit.estimatedGrossProfit === null) return "—";
    return (
      <span className={grossProfitPositive ? "text-success-500" : grossProfitNegative ? "text-error-500" : undefined}>
        <CurrencyDisplay value={Math.abs(grossProfit.estimatedGrossProfit)} />
      </span>
    );
  })();

  const statusNode = deriveStatusChip(cogsIncomplete, grossProfit, grossProfitIncomplete);

  return (
    <>
      <div className="text-center text-sm text-neutral-500 tabular-nums">
        {cogsCell} / {hargaJualCell}
      </div>

      <div className="text-right text-sm text-neutral-500 tabular-nums">{recPriceCell}</div>

      <div className="text-center text-sm text-neutral-500 tabular-nums">
        {grossProfitCell}
      </div>

      <div className="flex justify-start">{statusNode}</div>
    </>
  );
}
