import { describe, expect, it } from "vitest";
import { MovementType } from "@/features/inventory/domain/enums/movement-type";
import { StockAdjustmentReason } from "@/features/inventory/domain/enums/stock-adjustment-reason";
import {
  admitsCounted,
  admitsRemoved,
  admitsBothChannels,
  isNoteRequired,
  movementTypeForReason,
} from "@/features/inventory/domain/helpers/stock-adjustment-reason";

const ALL_REASONS = Object.values(StockAdjustmentReason);

// The reason-locked matrix enforced server-side. Each row asserts the full
// (counted, removed, noteRequired, movementType) tuple for one reason so any
// drift in the helper is caught immediately.
describe("stock-adjustment-reason helper matrix", () => {
  it("shrinkage admits both channels, requires a note, records opname_adjustment", () => {
    const r = StockAdjustmentReason.SHRINKAGE;
    expect(admitsCounted(r)).toBe(true);
    expect(admitsRemoved(r)).toBe(true);
    expect(admitsBothChannels(r)).toBe(true);
    expect(isNoteRequired(r)).toBe(true);
    expect(movementTypeForReason(r)).toBe(MovementType.OPNAME_ADJUSTMENT);
  });

  it("recount_overage admits counted only, note optional, records opname_adjustment", () => {
    const r = StockAdjustmentReason.RECOUNT_OVERAGE;
    expect(admitsCounted(r)).toBe(true);
    expect(admitsRemoved(r)).toBe(false);
    expect(admitsBothChannels(r)).toBe(false);
    expect(isNoteRequired(r)).toBe(false);
    expect(movementTypeForReason(r)).toBe(MovementType.OPNAME_ADJUSTMENT);
  });

  it("owner_withdrawal admits removed only, requires a note, records write_off", () => {
    const r = StockAdjustmentReason.OWNER_WITHDRAWAL;
    expect(admitsCounted(r)).toBe(false);
    expect(admitsRemoved(r)).toBe(true);
    expect(admitsBothChannels(r)).toBe(false);
    expect(isNoteRequired(r)).toBe(true);
    expect(movementTypeForReason(r)).toBe(MovementType.WRITE_OFF);
  });

  it("promotional_giveaway admits removed only, requires a note, records write_off", () => {
    const r = StockAdjustmentReason.PROMOTIONAL_GIVEAWAY;
    expect(admitsCounted(r)).toBe(false);
    expect(admitsRemoved(r)).toBe(true);
    expect(admitsBothChannels(r)).toBe(false);
    expect(isNoteRequired(r)).toBe(true);
    expect(movementTypeForReason(r)).toBe(MovementType.WRITE_OFF);
  });

  it("staff_consumption admits removed only, requires a note, records write_off", () => {
    const r = StockAdjustmentReason.STAFF_CONSUMPTION;
    expect(admitsCounted(r)).toBe(false);
    expect(admitsRemoved(r)).toBe(true);
    expect(admitsBothChannels(r)).toBe(false);
    expect(isNoteRequired(r)).toBe(true);
    expect(movementTypeForReason(r)).toBe(MovementType.WRITE_OFF);
  });

  it("business_use admits removed only, requires a note, records write_off", () => {
    const r = StockAdjustmentReason.BUSINESS_USE;
    expect(admitsCounted(r)).toBe(false);
    expect(admitsRemoved(r)).toBe(true);
    expect(admitsBothChannels(r)).toBe(false);
    expect(isNoteRequired(r)).toBe(true);
    expect(movementTypeForReason(r)).toBe(MovementType.WRITE_OFF);
  });

  it("every reason admits at least one channel", () => {
    for (const r of ALL_REASONS) {
      expect(admitsCounted(r) || admitsRemoved(r)).toBe(true);
    }
  });

  it("exactly one reason admits both channels (shrinkage)", () => {
    const dual = ALL_REASONS.filter(admitsBothChannels);
    expect(dual).toEqual([StockAdjustmentReason.SHRINKAGE]);
  });
});