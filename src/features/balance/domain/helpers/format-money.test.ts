import { describe, expect, it } from "vitest";
import { formatMoney } from "@/features/balance/domain/helpers/format-money";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { BalanceMovementEntity } from "@/features/balance/domain/entities/balance-movement";
import { MovementDirection, MovementDirectionType } from "@/features/balance/domain/enums/movement-direction";
import { SourceRefType } from "@/features/balance/domain/enums/source-ref-type";

/**
 * `id-ID` Intl output may join symbol and amount with a non-breaking space depending on the
 * runtime's ICU data, so the IDR assertions match on structure (`Rp` prefix, grouped digits)
 * rather than pinning the exact whitespace.
 */
describe("formatMoney", () => {
  it("formats IDR through IDRFormatter.toCurrency", () => {
    const formatted = formatMoney(12500, "IDR");

    expect(formatted).toBe(IDRFormatter.toCurrency(12500));
    expect(formatted).toMatch(/^Rp/);
    expect(formatted).toContain("12.500");
  });

  it("formats another currency as `<currency> <thousand-grouped amount>`", () => {
    expect(formatMoney(12500, "USD")).toBe("USD 12.500");
    expect(formatMoney(1250.5, "SGD")).toBe(`SGD ${IDRFormatter.toThousand(1250.5)}`);
  });

  it("formats a zero balance without treating it as missing", () => {
    expect(formatMoney(0, "IDR")).toBe(IDRFormatter.toCurrency(0));
  });

  it("applies no sign: the same amount formats identically whichever direction carries it", () => {
    const build = (direction: MovementDirectionType) =>
      new BalanceMovementEntity({
        id: "movement-1",
        direction,
        amount: 45000,
        currency: "IDR",
        sourceRefType: SourceRefType.PAYMENT_PAY_IN,
        sourceRefId: "pay-in-1",
        correctsMovementId: null,
        createdAt: "2026-08-31T00:00:00Z",
      });

    const credit = build(MovementDirection.CREDIT);
    const debit = build(MovementDirection.DEBIT);

    expect(formatMoney(credit.amount, credit.currency)).toBe(formatMoney(debit.amount, debit.currency));
    expect(formatMoney(debit.amount, debit.currency)).toBe(IDRFormatter.toCurrency(45000));
  });
});
