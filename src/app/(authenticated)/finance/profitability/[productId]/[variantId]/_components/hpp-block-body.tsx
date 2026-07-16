"use client";

import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { SectionCard } from "@/core/presentations/components/section-card";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { VariantHppEntity } from "@/features/profitability/domain/entities/variant-hpp";

type HppBlockBodyProps = {
  hpp: VariantHppEntity;
};

export function HppBlockBody({ hpp }: HppBlockBodyProps) {
  return (
    <SectionCard title="HPP">
      <div className="flex flex-col gap-y-1">
        <span className="text-xs font-medium uppercase tracking-wider text-neutral-300">HPP per unit</span>
        <span className="text-2xl font-bold text-neutral-500">{IDRFormatter.toCurrency(hpp.hppPerUnit)}</span>
      </div>

      {hpp.hasMissingCost && (
        <div className="mt-3 flex items-center gap-x-1.5">
          <ExclamationTriangleIcon className="size-3 shrink-0 text-warning-500" />
          <span className="text-xs text-warning-500">
            Beberapa bahan baku belum memiliki harga rata-rata. HPP mungkin tidak lengkap.
          </span>
        </div>
      )}

      <div className="my-4 border-t border-neutral-100" />

      <div className="flex flex-col gap-y-3">
        <div className="flex flex-row justify-between">
          <span className="text-sm text-neutral-300">Biaya Bahan Baku</span>
          <span className="text-sm font-medium text-neutral-500">
            {IDRFormatter.toCurrency(hpp.materialCostPerUnit)}
          </span>
        </div>
        <div className="flex flex-row justify-between">
          <span className="text-sm text-neutral-300">Biaya Pengemasan</span>
          <span className="text-sm font-medium text-neutral-500">
            {IDRFormatter.toCurrency(hpp.packagingCostPerUnit)}
          </span>
        </div>
        <div className="flex flex-row justify-between">
          <span className="text-sm text-neutral-300">Biaya Overhead</span>
          <span className="text-sm font-medium text-neutral-500">
            {IDRFormatter.toCurrency(hpp.overheadCostPerUnit)}
          </span>
        </div>
        {hpp.lines.length > 0 && (
          <>
            <div className="border-t border-neutral-100" />
            <div className="flex flex-col gap-y-2">
              <span className="text-xs font-medium uppercase tracking-wider text-neutral-300">Bahan Baku</span>
              {hpp.lines.map((line, index) => (
                <div key={`${line.rawMaterial.id}-${index}`} className="flex flex-row justify-between">
                  <span className="text-sm text-neutral-400">
                    {line.rawMaterial.name || "Bahan baku dihapus"}
                    {!line.costAvailable && (
                      <span className="ml-1 text-xs text-warning-500">(harga tidak tersedia)</span>
                    )}
                  </span>
                  <span className="text-sm text-neutral-500">{IDRFormatter.toCurrency(line.lineCost)}</span>
                </div>
              ))}
            </div>
          </>
        )}
        <div className="mt-1 flex flex-row justify-between">
          <span className="text-xs text-neutral-300">Dasar perhitungan</span>
          <span className="text-xs font-medium text-neutral-400">{hpp.basis}</span>
        </div>
      </div>
    </SectionCard>
  );
}
