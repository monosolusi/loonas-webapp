import { describe, expect, it } from "vitest";
import { BalanceMovementModel } from "@/features/balance/data/models/balance-movement";
import { MovementDirection } from "@/features/balance/domain/enums/movement-direction";
import { SourceRefType } from "@/features/balance/domain/enums/source-ref-type";

const FULL_MOVEMENT_JSON = {
  id: "0b6c6d3e-0001-4a5a-9d3e-1a2b3c4d5e6f",
  direction: "credit",
  amount: 150000,
  currency: "IDR",
  source_ref_type: "payment.pay_in",
  source_ref_id: "7c2e1f90-0002-4b6b-8e4f-2b3c4d5e6f70",
  corrects_movement_id: null,
  created_at: "2026-08-31T09:15:00Z",
};

/**
 * FR-6 AC-3 — every one of the eight contract fields survives `fromJson().toEntity()`, and
 * the two fields with a trap are pinned: the nullable `corrects_movement_id` never collapses
 * to 0 or "", and `amount` is carried through unchanged for BOTH directions (the sign lives
 * in `direction`, the DB enforces `CHECK (amount > 0)`).
 */
describe("BalanceMovementModel.fromJson → toEntity", () => {
  it("round-trips all eight contract fields", () => {
    const entity = BalanceMovementModel.fromJson(FULL_MOVEMENT_JSON).toEntity();

    expect(entity.id).toBe(FULL_MOVEMENT_JSON.id);
    expect(entity.direction).toBe(MovementDirection.CREDIT);
    expect(entity.amount).toBe(150000);
    expect(entity.currency).toBe("IDR");
    expect(entity.sourceRefType).toBe(SourceRefType.PAYMENT_PAY_IN);
    expect(entity.sourceRefId).toBe(FULL_MOVEMENT_JSON.source_ref_id);
    expect(entity.correctsMovementId).toBeNull();
    expect(entity.createdAt).toBe("2026-08-31T09:15:00Z");
  });

  it("keeps a present corrects_movement_id as the exact string", () => {
    const entity = BalanceMovementModel.fromJson({
      ...FULL_MOVEMENT_JSON,
      corrects_movement_id: "aa11bb22-0003-4c7c-9d5e-3c4d5e6f7081",
    }).toEntity();

    expect(entity.correctsMovementId).toBe("aa11bb22-0003-4c7c-9d5e-3c4d5e6f7081");
    expect(entity.isCorrection).toBe(true);
  });

  it.each([
    ["explicit JSON null", null],
    ["key omitted", undefined],
  ])("yields null — never 0 and never an empty string — when corrects_movement_id is %s", (_label, raw) => {
    const json = { ...FULL_MOVEMENT_JSON } as Record<string, unknown>;
    if (raw !== undefined) json["corrects_movement_id"] = raw;
    else delete json["corrects_movement_id"];

    const entity = BalanceMovementModel.fromJson(json).toEntity();

    expect(entity.correctsMovementId).toBeNull();
    expect(entity.correctsMovementId).not.toBe(0);
    expect(entity.correctsMovementId).not.toBe("");
    expect(entity.isCorrection).toBe(false);
  });

  it("carries the amount unchanged for a debit movement (no negation, no defaulting)", () => {
    const entity = BalanceMovementModel.fromJson({
      ...FULL_MOVEMENT_JSON,
      direction: "debit",
      amount: 42500,
    }).toEntity();

    expect(entity.direction).toBe(MovementDirection.DEBIT);
    expect(entity.amount).toBe(42500);
    expect(entity.isCredit).toBe(false);
  });
});
