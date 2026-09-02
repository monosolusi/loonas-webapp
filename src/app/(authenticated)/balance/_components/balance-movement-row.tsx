"use client";

import clsx from "clsx";
import { MobileListCard } from "@/core/presentations/components/table/mobile-list-card";
import { BalanceMovementEntity } from "@/features/balance/domain/entities/balance-movement";
import { MovementDirectionLabel } from "@/features/balance/domain/enums/movement-direction";
import { formatMoney } from "@/features/balance/domain/helpers/format-money";
import {
  buildSourceReferenceDisplay,
  classifyCorrectionCell,
  formatMovementDate,
} from "@/app/(authenticated)/balance/_utils/movement-row-display";

type BalanceMovementRowProps = {
  movement: BalanceMovementEntity;
};

// Exported and imported by `balance-movement-table.tsx`'s `TableHeader` `className` so the
// two stay literally identical by construction — the compiler enforces it, not a comment.
export const GRID_TEMPLATE = "grid-cols-[1fr_0.8fr_1fr_1.5fr_1fr] gap-x-4";

export function BalanceMovementRow({ movement }: BalanceMovementRowProps) {
  const directionLabel = MovementDirectionLabel[movement.direction];
  const correction = classifyCorrectionCell(movement);
  const sourceReference = buildSourceReferenceDisplay(movement.sourceRefType, movement.sourceRefId);
  const amount = formatMoney(movement.amount, movement.currency);
  const date = formatMovementDate(movement.createdAt);

  return (
    <>
      <div
        className={clsx(
          "hidden items-center border-b border-neutral-100 px-6 py-4 last:border-b-0 lg:grid",
          GRID_TEMPLATE,
        )}
      >
        <span className="text-sm text-neutral-400">{date}</span>
        <span className={clsx("text-sm font-medium", movement.isCredit ? "text-success-400" : "text-error-400")}>
          {movement.isCredit ? "+" : "−"} {directionLabel}
        </span>
        <span className="text-sm font-medium text-neutral-500">{amount}</span>
        <span className="truncate text-sm text-neutral-400" title={sourceReference.title}>
          {sourceReference.label}
        </span>
        {correction.kind === "none" ? (
          <span className="text-sm text-neutral-200">—</span>
        ) : (
          <span className="truncate text-sm text-neutral-400" title={correction.title}>
            {correction.label}
          </span>
        )}
      </div>

      <div className="lg:hidden">
        <MobileListCard
          title={sourceReference.label}
          subtitle={date}
          meta={correction.kind === "none" ? undefined : `Koreksi dari ${correction.label}`}
          trailingTop={amount}
          trailingBottom={
            <span className={clsx("text-xs font-medium", movement.isCredit ? "text-success-400" : "text-error-400")}>
              {movement.isCredit ? "+" : "−"} {directionLabel}
            </span>
          }
          chevron={false}
        />
      </div>
    </>
  );
}
