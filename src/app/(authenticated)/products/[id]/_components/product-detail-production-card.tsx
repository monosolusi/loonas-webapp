"use client";

import Link from "next/link";
import { SectionCard } from "@/core/presentations/components/section-card";
import { CurrencyDisplay } from "@/core/presentations/components/currency-display";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { ProductType } from "@/features/product/domain/enums/product-type";
import { ProductionMode } from "@/features/product/domain/enums/production-mode";
import { useListProductionRecords } from "@/features/production/presentations/hooks/use-list-production-records";
import { useProductDetail } from "@/app/(authenticated)/products/[id]/_providers/product-detail-provider";
import { ProductDetailProductionError } from "@/app/(authenticated)/products/[id]/_components/product-detail-production-error";

export function ProductDetailProductionCard() {
  const { product } = useProductDetail();

  const isManufacturedBatch =
    product?.type === ProductType.MANUFACTURED && product?.productionMode === ProductionMode.BATCH;

  const result = useListProductionRecords(
    isManufacturedBatch && product ? { productId: product.id, limit: 5 } : { limit: 0 },
  );

  if (!isManufacturedBatch || !product) return null;
  if (result.loading) return null;
  if (result.error) return <ProductDetailProductionError error={result.error} onRetry={() => result.refresh()} />;
  if (result.records.length === 0) return null;

  return (
    <SectionCard title="Riwayat Produksi" iconSrc="/assets/images/chart-icon-primary-300-w16-h16.svg">
      <div className="-mx-6 -mb-6 overflow-x-auto">
        <div className="min-w-[560px]">
          <div className="grid grid-cols-[1fr_1fr_0.6fr_1fr] gap-x-4 border-b border-neutral-100 bg-neutral-50 px-4 py-2">
            <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Tanggal</span>
            <span className="text-xs font-medium tracking-wider text-neutral-300 uppercase">Varian</span>
            <span className="text-right text-xs font-medium tracking-wider text-neutral-300 uppercase">Qty</span>
            <span className="text-right text-xs font-medium tracking-wider text-neutral-300 uppercase">Biaya Material</span>
          </div>
          {result.records.map((record) => (
            <Link
              key={record.id}
              href={`/productions/${record.id}`}
              className="grid grid-cols-[1fr_1fr_0.6fr_1fr] items-center gap-x-4 border-b border-neutral-100 px-4 py-3 last:border-b-0 hover:bg-primary-50"
            >
              <span className="text-sm leading-5 text-neutral-400">
                {record.producedAt.toFormat("dd MMM yyyy")}
              </span>
              <span className="text-sm leading-5 text-neutral-400">{record.variantName}</span>
              <span className="text-right text-sm leading-5 text-neutral-400">
                <NumberDisplay value={record.quantity} />
              </span>
              <span className="text-right text-sm leading-5 font-medium text-neutral-500">
                <CurrencyDisplay value={record.totalMaterialCost} />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
