"use client";

import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { ManagerialCostProjectionEntity } from "@/features/accounting/domain/entities/managerial-cost-projection";

function hasUsableName(name: string | null): boolean {
  return name != null && name.trim() !== "";
}

function hasUsableSku(sku: string | null): boolean {
  return sku != null && sku.trim() !== "";
}

type PeriodAllocationPanelDataProps = {
  projections: ManagerialCostProjectionEntity[];
};

export function PeriodAllocationPanelData({ projections }: PeriodAllocationPanelDataProps) {
  // Disclaimer comes from the first projection (all share the same disclaimer from BE)
  const disclaimer = projections[0]?.disclaimer ?? "";
  const capacityNote = projections[0]?.capacityNote ?? "";

  return (
    <div className="border-b border-neutral-100 bg-neutral-50">
      {disclaimer ? (
        <div className="flex items-start gap-x-3 border-b border-neutral-100 px-6 py-3">
          <InformationCircleIcon className="mt-0.5 size-4 shrink-0 text-neutral-300" aria-hidden="true" />
          <p className="text-xs text-neutral-400">{disclaimer}</p>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-sm">
          <thead>
            <tr className="border-b border-neutral-100">
              <th className="px-6 py-2.5 text-left text-xs font-medium text-neutral-400">Varian</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-neutral-400">Qty Produksi</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-neutral-400">Biaya Material/unit</th>
              <th className="px-4 py-2.5 text-right text-xs font-medium text-neutral-400">Biaya Tetap Alokasi/unit</th>
              <th className="px-6 py-2.5 text-right text-xs font-medium text-neutral-400">Total Loaded/unit</th>
            </tr>
          </thead>
          <tbody>
            {projections.map((proj, index) => (
              <tr
                key={proj.variantId + "-" + index}
                className="border-b border-neutral-100 last:border-b-0"
              >
                <td className="px-6 py-3 text-sm font-medium text-neutral-500">
                  {hasUsableName(proj.variantName) && hasUsableSku(proj.sku) ? (
                    <div>
                      <span className="block truncate text-sm font-medium text-neutral-500" title={proj.variantName ?? undefined}>{proj.variantName}</span>
                      <span className="block text-xs text-neutral-300">{proj.sku}</span>
                    </div>
                  ) : hasUsableName(proj.variantName) ? (
                    <div>
                      <span className="block truncate text-sm font-medium text-neutral-500" title={proj.variantName ?? undefined}>{proj.variantName}</span>
                    </div>
                  ) : (
                    <div>
                      <span className="block text-sm font-mono text-neutral-300" title={"ID: " + proj.variantId}>{"#" + proj.variantId.slice(0, 8)}</span>
                      <span className="block text-xs italic text-neutral-300">Varian tidak tersedia</span>
                    </div>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-sm text-neutral-400">
                  <NumberDisplay value={proj.productionQuantity} />
                </td>
                <td className="px-4 py-3 text-right text-sm text-neutral-400">
                  <NumberDisplay value={proj.materialCostPerUnit} prefix="Rp" />
                </td>
                <td className="px-4 py-3 text-right text-sm text-neutral-400">
                  <NumberDisplay value={proj.allocatedProductionFixedPerUnit} prefix="Rp" />
                </td>
                <td className="px-6 py-3 text-right text-sm font-semibold text-neutral-500">
                  <NumberDisplay value={proj.loadedCostPerUnit} prefix="Rp" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {capacityNote ? (
        <div className="px-6 py-3">
          <p className="text-xs text-neutral-400">{capacityNote}</p>
        </div>
      ) : null}
    </div>
  );
}
