"use client";

import clsx from "clsx";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
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
    return <StatusChip variant="neutral" label="Data Kurang" compact />;
  }
  if (!grossProfit) return null;
  if (grossProfit.needsData) {
    return <StatusChip variant="neutral" label="Belum Ada Penjualan" compact />;
  }
  if (grossProfit.estimasiLabaKotor === null) return null;
  if (grossProfit.estimasiLabaKotor < 0) {
    return <StatusChip variant="error" label="Rugi" compact />;
  }
  return <StatusChip variant="success" label="Menguntungkan" compact />;
}

export function ProfitabilityTableRowData({
  hpp,
  hppIncomplete,
  grossProfit,
  grossProfitIncomplete,
  recommendedPrice,
  variantPrice,
}: ProfitabilityTableRowDataProps) {
  const hppValue = hpp ? IDRFormatter.toCurrency(hpp.hppPerUnit) : "—";
  const hargaJualValue = IDRFormatter.toCurrency(variantPrice);
  const recPriceValue = recommendedPrice ? IDRFormatter.toCurrency(recommendedPrice.recommendedPrice) : "—";

  const grossProfitValue = (() => {
    if (grossProfitIncomplete) return "—";
    if (!grossProfit) return "—";
    if (grossProfit.needsData) return "—";
    if (grossProfit.estimasiLabaKotor === null) return "—";
    const sign = grossProfit.estimasiLabaKotor >= 0 ? "+" : "−";
    const absVal = IDRFormatter.toCurrency(Math.abs(grossProfit.estimasiLabaKotor));
    return `${sign} ${absVal}`;
  })();

  const grossProfitPositive =
    grossProfit?.estimasiLabaKotor !== undefined &&
    grossProfit?.estimasiLabaKotor !== null &&
    grossProfit.estimasiLabaKotor >= 0 &&
    !grossProfit.needsData;

  const marginValue = (() => {
    if (grossProfitIncomplete) return "—";
    if (!grossProfit) return "—";
    if (grossProfit.needsData) return "—";
    if (recommendedPrice) return `${recommendedPrice.marginPersen.toLocaleString("id-ID")}%`;
    return "—";
  })();

  const statusNode = deriveStatusChip(hppIncomplete, grossProfit, grossProfitIncomplete);

  return (
    <>
      <div className="text-right text-sm text-neutral-500">{hppValue}</div>
      <div className="text-right text-sm text-neutral-500">{hargaJualValue}</div>
      <div className="text-right text-sm text-neutral-500">{recPriceValue}</div>
      <div
        className={clsx(
          "text-right text-sm",
          grossProfitPositive ? "text-success-500" : grossProfit?.estimasiLabaKotor !== null && !grossProfit?.needsData ? "text-error-500" : "text-neutral-300",
        )}
      >
        {grossProfitValue}
      </div>
      <div className="text-right text-sm text-neutral-500">{marginValue}</div>
      <div className="flex justify-center">{statusNode}</div>
    </>
  );
}
