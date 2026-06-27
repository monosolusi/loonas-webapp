"use client";

import { StatusChip } from "@/core/presentations/components/status-chip";
import { CurrencyDisplay } from "@/core/presentations/components/currency-display";
import { VariantHppEntity } from "@/features/profitability/domain/entities/variant-hpp";
import { VariantGrossProfitEntity } from "@/features/profitability/domain/entities/variant-gross-profit";
import { VariantRecommendedPriceEntity } from "@/features/profitability/domain/entities/variant-recommended-price";

type ProfitabilityTableRowDataProps = {
  hpp: VariantHppEntity | null;
  hppIncomplete: boolean;
  grossProfit: VariantGrossProfitEntity | null;
  grossProfitIncomplete: boolean;
  recommendedPrice: VariantRecommendedPriceEntity | null;
  variantPrice: number;
};

function deriveStatusChip(
  hppIncomplete: boolean,
  grossProfit: VariantGrossProfitEntity | null,
  grossProfitIncomplete: boolean,
): React.ReactNode {
  if (hppIncomplete || grossProfitIncomplete) {
    return <StatusChip variant="warning" label="Kurang" compact />;
  }
  if (!grossProfit) return null;
  if (grossProfit.needsData) {
    return <StatusChip variant="neutral" label="Belum Jual" compact />;
  }
  if (grossProfit.estimasiLabaKotor === null) return null;
  if (grossProfit.estimasiLabaKotor < 0) {
    return <StatusChip variant="error" label="Rugi" compact />;
  }
  return <StatusChip variant="success" label="Untung" compact />;
}

export function ProfitabilityTableRowData({
  hpp,
  hppIncomplete,
  grossProfit,
  grossProfitIncomplete,
  recommendedPrice,
  variantPrice,
}: ProfitabilityTableRowDataProps) {
  const hppCell = hpp ? <CurrencyDisplay value={hpp.hppPerUnit} /> : "—";
  const hargaJualCell = <CurrencyDisplay value={variantPrice} />;
  const recPriceCell = recommendedPrice ? <CurrencyDisplay value={recommendedPrice.recommendedPrice} /> : "—";

  const grossProfitPositive =
    grossProfit?.estimasiLabaKotor !== undefined &&
    grossProfit?.estimasiLabaKotor !== null &&
    grossProfit.estimasiLabaKotor >= 0 &&
    !grossProfit.needsData;

  const grossProfitNegative =
    grossProfit?.estimasiLabaKotor !== undefined &&
    grossProfit?.estimasiLabaKotor !== null &&
    grossProfit.estimasiLabaKotor < 0 &&
    !grossProfit.needsData;

  const grossProfitCell = (() => {
    if (grossProfitIncomplete) return "—";
    if (!grossProfit) return "—";
    if (grossProfit.needsData) return "—";
    if (grossProfit.estimasiLabaKotor === null) return "—";
    return (
      <span className={grossProfitPositive ? "text-success-500" : grossProfitNegative ? "text-error-500" : undefined}>
        <CurrencyDisplay value={Math.abs(grossProfit.estimasiLabaKotor)} />
      </span>
    );
  })();

  const statusNode = deriveStatusChip(hppIncomplete, grossProfit, grossProfitIncomplete);

  return (
    <>
      <div className="text-center text-sm text-neutral-500 tabular-nums">
        {hppCell} / {hargaJualCell}
      </div>

      <div className="text-right text-sm text-neutral-500 tabular-nums">{recPriceCell}</div>

      <div className="text-center text-sm text-neutral-500 tabular-nums">
        {grossProfitCell}
      </div>

      <div className="flex justify-start">{statusNode}</div>
    </>
  );
}
