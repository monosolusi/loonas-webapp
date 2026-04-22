"use client";

import { SectionCard } from "@/core/presentations/components/section-card";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { useProductionDetail } from "@/app/(authenticated)/productions/[id]/_providers/production-detail-provider";

export function ProductionDetailInfoCard() {
  const { record } = useProductionDetail();

  return (
    <SectionCard title="Informasi" iconSrc="/assets/images/box-icon-primary-300-w16-h16.svg">
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-row items-center justify-between">
          <span className="text-sm text-neutral-300">Produk</span>
          <span className="text-sm font-medium text-neutral-500">{record.productName}</span>
        </div>
        <div className="flex flex-row items-center justify-between">
          <span className="text-sm text-neutral-300">Varian</span>
          <span className="text-sm font-medium text-neutral-500">{record.variantName}</span>
        </div>
        <div className="flex flex-row items-center justify-between">
          <span className="text-sm text-neutral-300">Jumlah</span>
          <span className="text-sm font-medium text-neutral-500">
            <NumberDisplay value={record.quantity} />
          </span>
        </div>
        <div className="flex flex-row items-center justify-between">
          <span className="text-sm text-neutral-300">Tanggal Produksi</span>
          <span className="text-sm font-medium text-neutral-500">
            {record.producedAt.toFormat("dd MMM yyyy")}
          </span>
        </div>
        <div className="flex flex-row items-center justify-between">
          <span className="text-sm text-neutral-300">Catatan</span>
          <span className="text-sm font-medium text-neutral-500">{record.note ?? "—"}</span>
        </div>
        <div className="flex flex-row items-center justify-between">
          <span className="text-sm text-neutral-300">Dibuat</span>
          <span className="text-sm text-neutral-400">
            {record.createdAt.toFormat("dd MMM yyyy")}
          </span>
        </div>
      </div>
    </SectionCard>
  );
}
