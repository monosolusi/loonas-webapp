import { MovementType, MovementTypeType } from "@/features/inventory/domain/enums/movement-type";
import { StockAdjustmentReasonType } from "@/features/inventory/domain/enums/stock-adjustment-reason";

// The reason-locked matrix enforced server-side. This is the single source of
// truth for the UI — never re-derive these rules at call sites (LNS-570 rule).
//
// | reason              | counted | removed | note   | movementType       |
// |---------------------|---------|---------|--------|--------------------|
// | shrinkage           | allowed | allowed | reqd   | opname_adjustment  |
// | recount_overage     | reqd    | forbidd | option | opname_adjustment  |
// | owner_withdrawal    | forbidd | reqd    | reqd   | write_off          |
// | promotional_giveaway | forbidd | reqd    | reqd   | write_off          |
// | staff_consumption   | forbidd | reqd    | reqd   | write_off          |
// | business_use        | forbidd | reqd    | reqd   | write_off          |

const COUNTED_REASONS: ReadonlySet<StockAdjustmentReasonType> = new Set([
  "shrinkage",
  "recount_overage",
]);

const REMOVED_REASONS: ReadonlySet<StockAdjustmentReasonType> = new Set([
  "shrinkage",
  "owner_withdrawal",
  "promotional_giveaway",
  "staff_consumption",
  "business_use",
]);

const NOTE_REQUIRED_REASONS: ReadonlySet<StockAdjustmentReasonType> = new Set([
  "shrinkage",
  "owner_withdrawal",
  "promotional_giveaway",
  "staff_consumption",
  "business_use",
]);

const MOVEMENT_TYPE_BY_REASON: Record<StockAdjustmentReasonType, MovementTypeType> = {
  shrinkage: MovementType.OPNAME_ADJUSTMENT,
  recount_overage: MovementType.OPNAME_ADJUSTMENT,
  owner_withdrawal: MovementType.WRITE_OFF,
  promotional_giveaway: MovementType.WRITE_OFF,
  staff_consumption: MovementType.WRITE_OFF,
  business_use: MovementType.WRITE_OFF,
};

/** Whether the reason admits the `counted_quantity` (opname recount) channel. */
export function admitsCounted(reason: StockAdjustmentReasonType): boolean {
  return COUNTED_REASONS.has(reason);
}

/** Whether the reason admits the `removed_quantity` channel. */
export function admitsRemoved(reason: StockAdjustmentReasonType): boolean {
  return REMOVED_REASONS.has(reason);
}

/** Whether the note field is REQUIRED for this reason (independent of channel). */
export function isNoteRequired(reason: StockAdjustmentReasonType): boolean {
  return NOTE_REQUIRED_REASONS.has(reason);
}

/** The `Movement.type` the backend records for an adjustment with this reason. */
export function movementTypeForReason(reason: StockAdjustmentReasonType): MovementTypeType {
  return MOVEMENT_TYPE_BY_REASON[reason];
}

/** Whether the reason admits BOTH channels (merchant must pick one — shrinkage only). */
export function admitsBothChannels(reason: StockAdjustmentReasonType): boolean {
  return admitsCounted(reason) && admitsRemoved(reason);
}