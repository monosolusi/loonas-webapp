"use client";

import { useState } from "react";
import { useProfitabilityDetail } from "@/app/(authenticated)/accounting/profitability/[productId]/[variantId]/_providers/profitability-detail-provider";
import { useGetVariantProductionCost } from "@/features/profitability/presentations/hooks/use-get-variant-production-cost";
import { CostStructureBlockLoading } from "@/app/(authenticated)/accounting/profitability/[productId]/[variantId]/_components/cost-structure-block-loading";
import { DataKurangCard } from "@/app/(authenticated)/accounting/profitability/[productId]/[variantId]/_components/data-kurang-card";
import { CostStructureBlockError } from "@/app/(authenticated)/accounting/profitability/[productId]/[variantId]/_components/cost-structure-block-error";
import { CostStructureBlockBody } from "@/app/(authenticated)/accounting/profitability/[productId]/[variantId]/_components/cost-structure-block-body";

export function CostStructureBlock() {
  const { productId, variantId } = useProfitabilityDetail();
  const [quantity, setQuantity] = useState(1);

  const state = useGetVariantProductionCost({ productId, variantId, quantity });
  const refresh = state.refresh;

  function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseInt(e.target.value, 10);
    if (!isNaN(val) && val >= 1) setQuantity(val);
  }

  if (state.isIncompleteRecipe) {
    return (
      <DataKurangCard
        title="Struktur Biaya"
        description="Struktur biaya tidak bisa ditampilkan karena resep atau harga bahan baku produk ini belum diisi."
        productId={productId}
      />
    );
  }

  return (
    <div className="flex flex-col gap-y-3">
      <div className="flex flex-col gap-2 rounded-lg border border-neutral-100 px-4 py-3 sm:flex-row sm:items-center sm:gap-x-3">
        <label htmlFor="cost-structure-quantity" className="text-sm text-neutral-400">
          Simulasi jumlah produksi
        </label>
        <div className="flex flex-row items-center gap-x-3">
          <input
            id="cost-structure-quantity"
            type="number"
            min={1}
            step={1}
            value={quantity}
            onChange={handleQuantityChange}
            className="h-11 w-24 rounded-lg border border-neutral-100 px-3 text-sm text-neutral-500 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-300/20"
            aria-label="Jumlah unit produksi"
          />
          <span className="text-sm text-neutral-300">unit</span>
        </div>
      </div>

      {state.loading ? (
        <CostStructureBlockLoading />
      ) : state.error ? (
        <CostStructureBlockError onRetry={() => { void refresh().catch(() => {}); }} />
      ) : (
        <CostStructureBlockBody productionCost={state.data} />
      )}
    </div>
  );
}
