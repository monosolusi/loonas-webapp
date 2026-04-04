"use client";

import { DateTime } from "luxon";
import { StatusChip } from "@/core/presentations/components/status-chip";
import { StockMovementEntity } from "@/features/inventory/domain/entities/stock-movement";
import { MovementTypeLabel, MovementTypeType } from "@/features/inventory/domain/enums/movement-type";

type RawMaterialMovementRowProps = {
  movement: StockMovementEntity;
};

export function RawMaterialMovementRow({ movement }: RawMaterialMovementRowProps) {
  return (
    <div className="grid grid-cols-[1fr_1fr_0.6fr_1.5fr] items-center gap-x-4 border-b border-neutral-100 px-4 py-3 last:border-b-0">
      <span className="text-sm leading-5 text-neutral-400">
        {DateTime.fromISO(movement.createdAt).toFormat("dd MMM yyyy")}
      </span>
      <StatusChip
        label={MovementTypeLabel[movement.type as MovementTypeType] ?? movement.type}
        variant={movement.isStockIn ? "success" : "error"}
        compact
      />
      <span className="text-sm leading-5 text-neutral-400">{Math.abs(movement.quantity)}</span>
      <span className="truncate text-sm leading-5 text-neutral-300">{movement.note ?? "—"}</span>
    </div>
  );
}
