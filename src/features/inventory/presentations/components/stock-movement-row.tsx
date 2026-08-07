"use client";

import clsx from "clsx";
import { DateTime } from "luxon";
import { NumberDisplay } from "@/core/presentations/components/number-display";
import { StockMovementEntity } from "@/features/inventory/domain/entities/stock-movement";
import { MovementTypeLabel, MovementTypeType } from "@/features/inventory/domain/enums/movement-type";
import {
  StockAdjustmentReasonLabel,
  StockAdjustmentReasonType,
} from "@/features/inventory/domain/enums/stock-adjustment-reason";

type StockMovementRowProps = {
  movement: StockMovementEntity;
};

export function StockMovementRow({ movement }: StockMovementRowProps) {
  const reasonLabel =
    movement.reason && movement.reason in StockAdjustmentReasonLabel
      ? StockAdjustmentReasonLabel[movement.reason as StockAdjustmentReasonType]
      : null;

  return (
    <div className="grid grid-cols-[1fr_1fr_1.5fr_0.8fr_1.5fr] items-center gap-x-4 border-b border-neutral-100 px-4 py-3 last:border-b-0">
      <span className="text-sm leading-5 text-neutral-400">
        {DateTime.fromISO(movement.effectiveAt || movement.createdAt).toFormat("dd MMM yyyy")}
      </span>
      <span className="text-sm leading-5 text-neutral-400">
        {MovementTypeLabel[movement.type as MovementTypeType] ?? movement.type}
      </span>
      <span className="truncate text-sm leading-5 text-neutral-300">{reasonLabel ?? "—"}</span>
      <span
        className={clsx(
          "text-sm leading-5 font-medium",
          movement.isStockIn ? "text-success-400" : "text-error-400",
        )}
      >
        {movement.isStockIn ? "+" : ""}
        <NumberDisplay value={movement.quantity} />
      </span>
      <span className="truncate text-sm leading-5 text-neutral-300">{movement.note ?? "—"}</span>
    </div>
  );
}