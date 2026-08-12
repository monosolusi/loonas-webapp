import { describe, expect, it } from "vitest";
import { PriceTierEntity } from "@/features/product/domain/entities/price-tier";
import { PriceTierScheduleEntity } from "@/features/product/domain/entities/price-tier-schedule";
import { TierMode } from "@/features/product/domain/enums/tier-mode";
import { previewLinePrice } from "@/features/product/domain/helpers/price-tier-preview";

function schedule(mode: typeof TierMode.VOLUME | typeof TierMode.GRADUATED, tiers: [number, number][]) {
  return new PriceTierScheduleEntity({
    tierMode: mode,
    tiers: tiers.map(([minQty, unitPrice]) => new PriceTierEntity({ minQty, unitPrice })),
  });
}

describe("previewLinePrice — VOLUME", () => {
  it("charges the base price below every break", () => {
    const result = previewLinePrice({ basePrice: 10_000, schedule: schedule(TierMode.VOLUME, [[10, 9_000]]), qty: 5 });

    expect(result.estimatedLineAmount).toBe(50_000);
    expect(result.isTiered).toBe(false);
    expect(result.appliedTierMinQty).toBeNull();
  });

  it("applies the highest bracket reached to the whole quantity", () => {
    const result = previewLinePrice({
      basePrice: 10_000,
      schedule: schedule(TierMode.VOLUME, [
        [10, 9_000],
        [50, 8_000],
      ]),
      qty: 50,
    });

    expect(result.estimatedLineAmount).toBe(400_000);
    expect(result.appliedTierMinQty).toBe(50);
    expect(result.isTiered).toBe(true);
  });

  it("enters a bracket inclusively at its threshold", () => {
    const result = previewLinePrice({ basePrice: 10_000, schedule: schedule(TierMode.VOLUME, [[10, 9_000]]), qty: 10 });

    expect(result.appliedTierMinQty).toBe(10);
    expect(result.estimatedLineAmount).toBe(90_000);
  });

  it("handles a fractional threshold and a fractional quantity", () => {
    const result = previewLinePrice({
      basePrice: 10_000,
      schedule: schedule(TierMode.VOLUME, [[1.5, 8_000]]),
      qty: 2.5,
    });

    expect(result.appliedTierMinQty).toBe(1.5);
    expect(result.estimatedLineAmount).toBe(20_000);
  });

  it("sorts an out-of-order schedule without mutating the input", () => {
    const input = schedule(TierMode.VOLUME, [
      [50, 8_000],
      [10, 9_000],
    ]);

    const result = previewLinePrice({ basePrice: 10_000, schedule: input, qty: 20 });

    expect(result.appliedTierMinQty).toBe(10);
    expect(input.tiers[0].minQty).toBe(50);
  });
});

describe("previewLinePrice — GRADUATED", () => {
  it("prices each bracket across its own span", () => {
    const result = previewLinePrice({
      basePrice: 10_000,
      schedule: schedule(TierMode.GRADUATED, [
        [10, 9_000],
        [50, 8_000],
      ]),
      qty: 60,
    });

    // 10 x 10.000 + 40 x 9.000 + 10 x 8.000
    expect(result.estimatedLineAmount).toBe(540_000);
    expect(result.appliedTierMinQty).toBe(50);
    expect(result.isTiered).toBe(true);
  });

  // AC-22: a GRADUATED line's unit price is a blend, so qty x price must NOT reproduce
  // the line amount. This is exactly the case that produces a wrong receipt if a caller
  // recomputes the total instead of reading the server's amount_before_tax.
  it("blends a unit price that does NOT reproduce the line amount", () => {
    const result = previewLinePrice({
      basePrice: 10_000,
      schedule: schedule(TierMode.GRADUATED, [[10, 9_000]]),
      qty: 12,
    });

    // 10 x 10.000 + 2 x 9.000
    expect(result.estimatedLineAmount).toBe(118_000);

    // 118.000 / 12 = 9.833,33... — the blend is presentational only.
    expect(result.estimatedUnitPrice).toBe(9_833.33);
    expect(result.estimatedUnitPrice * 12).not.toBe(result.estimatedLineAmount);
  });
});

describe("previewLinePrice — flat and edge cases", () => {
  it("treats an unhydrated schedule as flat", () => {
    const result = previewLinePrice({ basePrice: 10_000, schedule: null, qty: 3 });

    expect(result.estimatedLineAmount).toBe(30_000);
    expect(result.isTiered).toBe(false);
  });

  it("treats an empty schedule as flat", () => {
    const result = previewLinePrice({ basePrice: 10_000, schedule: schedule(TierMode.VOLUME, []), qty: 3 });

    expect(result.estimatedLineAmount).toBe(30_000);
    expect(result.isTiered).toBe(false);
  });

  it("returns zero for a non-positive quantity", () => {
    const result = previewLinePrice({ basePrice: 10_000, schedule: null, qty: 0 });

    expect(result.estimatedLineAmount).toBe(0);
    expect(result.estimatedUnitPrice).toBe(10_000);
  });

  // AC-26: amounts are whole rupiah. A stray /100 would render 250 here and a stray
  // *100 would render 2.500.000 — both visible against the expected 25.000.
  it("treats amounts as whole rupiah with no minor-unit conversion", () => {
    const result = previewLinePrice({ basePrice: 25_000, schedule: null, qty: 1 });

    expect(result.estimatedLineAmount).toBe(25_000);
    expect(result.estimatedUnitPrice).toBe(25_000);
  });
});
