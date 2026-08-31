import { describe, expect, it } from "vitest";
import { BalanceMovementEntity } from "@/features/balance/domain/entities/balance-movement";
import { MovementDirection } from "@/features/balance/domain/enums/movement-direction";
import { SourceRefType } from "@/features/balance/domain/enums/source-ref-type";

function buildMovement(overrides: Partial<ConstructorParameters<typeof BalanceMovementEntity>[0]> = {}) {
  return new BalanceMovementEntity({
    id: "movement-1",
    direction: MovementDirection.CREDIT,
    amount: 12500,
    currency: "IDR",
    sourceRefType: SourceRefType.PAYMENT_PAY_IN,
    sourceRefId: "pay-in-1",
    correctsMovementId: null,
    createdAt: "2026-08-31T00:00:00Z",
    ...overrides,
  });
}

// FR-6 AC-3: the entity exposes exactly two derived getters. `isDebit` is deliberately
// absent — call sites branch on `!isCredit`, so a complement getter would only restate the
// predicate and drift from it.
describe("BalanceMovementEntity derived getters", () => {
  it("isCredit is true only for the credit direction", () => {
    expect(buildMovement({ direction: MovementDirection.CREDIT }).isCredit).toBe(true);
    expect(buildMovement({ direction: MovementDirection.DEBIT }).isCredit).toBe(false);
  });

  it("exposes no isDebit getter — debit is the complement of isCredit", () => {
    const movement = buildMovement({ direction: MovementDirection.DEBIT }) as unknown as Record<string, unknown>;

    expect(movement["isDebit"]).toBeUndefined();
    expect(buildMovement({ direction: MovementDirection.DEBIT }).isCredit).toBe(false);
  });

  it("isCorrection is true only when the movement points back at another movement", () => {
    expect(buildMovement({ correctsMovementId: null }).isCorrection).toBe(false);
    expect(buildMovement({ correctsMovementId: "movement-0" }).isCorrection).toBe(true);
  });

  it("carries the amount unchanged for both directions — the sign lives in direction", () => {
    const credit = buildMovement({ direction: MovementDirection.CREDIT, amount: 7000 });
    const debit = buildMovement({ direction: MovementDirection.DEBIT, amount: 7000 });

    expect(credit.amount).toBe(7000);
    expect(debit.amount).toBe(7000);
  });
});
