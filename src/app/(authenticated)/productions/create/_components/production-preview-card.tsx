"use client";

import { SectionCard } from "@/core/presentations/components/section-card";
import { CurrencyDisplay } from "@/core/presentations/components/currency-display";
import { useProductionCreate } from "@/app/(authenticated)/productions/create/_providers/production-create-provider";
import { ProductionPreviewRow } from "@/app/(authenticated)/productions/create/_components/production-preview-row";

export function ProductionPreviewCard() {
  const { preview, previewLoading, product, variantId, quantity } = useProductionCreate();

  const hasValidInput = !!product && !!variantId && quantity > 0;

  return (
    <SectionCard title="Estimasi Bahan Baku" iconSrc="/assets/images/chart-icon-primary-300-w16-h16.svg">
      {!hasValidInput && (
        <div className="flex items-center justify-center py-8">
          <span className="text-sm text-neutral-300">Pilih produk dan jumlah untuk melihat estimasi</span>
        </div>
      )}

      {hasValidInput && !preview && (
        <div className="flex items-center justify-center py-8">
          <span className="text-sm text-neutral-300">
            {previewLoading ? "Menghitung estimasi..." : "Tidak dapat menghitung estimasi"}
          </span>
        </div>
      )}

      {hasValidInput && preview && (
        <div className="-mx-6 -mb-6">
          <div className="grid grid-cols-[1.5fr_0.7fr_0.7fr_0.8fr_0.8fr_0.8fr] gap-x-4 border-b border-neutral-100 bg-neutral-50 px-4 py-2">
            <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Bahan Baku</span>
            <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Dipakai</span>
            <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Tersedia</span>
            <span className="text-right text-xs font-medium tracking-wider text-neutral-300 uppercase">Biaya/Unit</span>
            <span className="text-right text-xs font-medium tracking-wider text-neutral-300 uppercase">Total</span>
            <span className="text-right text-xs font-medium tracking-wider text-neutral-300 uppercase">Sisa</span>
          </div>
          {preview.items.map((item) => (
            <ProductionPreviewRow key={item.id} item={item} />
          ))}
          <div className="flex flex-row items-center justify-between border-t border-neutral-100 px-4 py-3">
            {!preview.canProduce && (
              <span className="text-xs font-medium text-error-400">Stok bahan baku tidak mencukupi</span>
            )}
            {preview.canProduce && <span />}
            <div className="flex flex-row items-center gap-x-2">
              <span className="text-sm text-neutral-300">Total Biaya Material</span>
              <span className="text-sm font-semibold text-neutral-500">
                <CurrencyDisplay value={preview.totalMaterialCost} />
              </span>
            </div>
          </div>
        </div>
      )}
    </SectionCard>
  );
}
