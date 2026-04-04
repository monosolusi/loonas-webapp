"use client";

import { DateTime } from "luxon";
import { SectionCard } from "@/core/presentations/components/section-card";
import { RawMaterialUnitLabel, RawMaterialUnitType } from "@/features/raw-material/domain/enums/raw-material-unit";
import { useRawMaterialDetail } from "@/app/(authenticated)/settings/raw-materials/[id]/_providers/raw-material-detail-provider";

export function RawMaterialDetailInfoCard() {
  const { rawMaterial } = useRawMaterialDetail();
  if (!rawMaterial) return null;

  return (
    <SectionCard title="Informasi">
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-row items-center justify-between">
          <span className="text-sm text-neutral-300">Nama</span>
          <span className="text-sm font-medium text-neutral-500">{rawMaterial.name}</span>
        </div>
        <div className="flex flex-row items-center justify-between">
          <span className="text-sm text-neutral-300">Satuan</span>
          <span className="text-sm font-medium text-neutral-500">
            {RawMaterialUnitLabel[rawMaterial.unit as RawMaterialUnitType] ?? rawMaterial.unit}
          </span>
        </div>
        <div className="flex flex-row items-center justify-between">
          <span className="text-sm text-neutral-300">Dibuat</span>
          <span className="text-sm text-neutral-400">
            {DateTime.fromISO(rawMaterial.createdAt).toFormat("dd MMM yyyy")}
          </span>
        </div>
      </div>
    </SectionCard>
  );
}
