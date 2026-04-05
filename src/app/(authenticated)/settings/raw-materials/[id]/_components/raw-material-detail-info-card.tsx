"use client";

import { useState } from "react";
import { DateTime } from "luxon";
import { SectionCard } from "@/core/presentations/components/section-card";
import { ActionMenu } from "@/core/presentations/components/action-menu";
import { RawMaterialUnitLabel, RawMaterialUnitType } from "@/features/raw-material/domain/enums/raw-material-unit";
import { RawMaterialEntity } from "@/features/raw-material/domain/entities/raw-material";
import { useRawMaterialDetail } from "@/app/(authenticated)/settings/raw-materials/[id]/_providers/raw-material-detail-provider";
import { RawMaterialDetailEditDialog } from "@/app/(authenticated)/settings/raw-materials/[id]/_components/raw-material-detail-edit-dialog";

export function RawMaterialDetailInfoCard() {
  const { rawMaterial } = useRawMaterialDetail();
  const [editingItem, setEditingItem] = useState<RawMaterialEntity | null>(null);

  return (
    <>
      <SectionCard
        title="Informasi"
        iconSrc="/assets/images/box-icon-primary-300-w16-h16.svg"
        headerAction={
          <ActionMenu options={[{ label: "Edit", onClick: () => setEditingItem(rawMaterial) }]} />
        }
      >
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
      <RawMaterialDetailEditDialog item={editingItem} onClose={() => setEditingItem(null)} />
    </>
  );
}
