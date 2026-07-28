import { describe, expect, it } from "vitest";
import { VariantModel } from "@/features/product/data/models/variant";
import { VariantForSaleModel } from "@/features/product/data/models/variant-for-sale";
import { TierMode } from "@/features/product/domain/enums/tier-mode";

/**
 * AC-16 — an absent `price_tiers` key and an empty array are different statements and
 * must not be collapsed.
 *
 * Absent means the endpoint does not hydrate schedules at all (invoice, purchasing,
 * inventory and production reads), and says nothing about whether the variant has tiers,
 * so no tier information and no "no tiers configured" state may be rendered. An empty
 * array means hydrated and genuinely flat-priced.
 */
describe("VariantModel — absent vs empty price_tiers", () => {
  it("yields a null schedule when the key is absent", () => {
    const model = VariantModel.fromJson({ id: "v1", name: "Default", price: 10_000 });

    expect(model.priceTierSchedule).toBeNull();
    expect(model.toEntity().priceTierSchedule).toBeNull();
  });

  it("yields a hydrated empty schedule when the array is empty", () => {
    const model = VariantModel.fromJson({
      id: "v1",
      name: "Default",
      price: 10_000,
      tier_mode: "VOLUME",
      price_tiers: [],
    });

    expect(model.priceTierSchedule).not.toBeNull();

    const schedule = model.toEntity().priceTierSchedule;
    expect(schedule).not.toBeNull();
    expect(schedule!.hasTiers).toBe(false);
    expect(schedule!.tiers).toHaveLength(0);
  });

  it("distinguishes the two: null is not an empty schedule", () => {
    const absent = VariantModel.fromJson({ id: "v1", name: "Default", price: 10_000 });
    const empty = VariantModel.fromJson({ id: "v1", name: "Default", price: 10_000, price_tiers: [] });

    expect(absent.priceTierSchedule).toBeNull();
    expect(empty.priceTierSchedule).not.toBeNull();
    expect(absent.priceTierSchedule).not.toEqual(empty.priceTierSchedule);
  });

  it("treats an explicit JSON null the same as an absent key", () => {
    const model = VariantModel.fromJson({ id: "v1", name: "Default", price: 10_000, price_tiers: null });

    expect(model.priceTierSchedule).toBeNull();
  });

  it("parses tiers and the mode when hydrated", () => {
    const model = VariantModel.fromJson({
      id: "v1",
      name: "Default",
      price: 10_000,
      tier_mode: "GRADUATED",
      price_tiers: [
        { min_qty: 1.5, unit_price: 9_500 },
        { min_qty: 10, unit_price: 9_000 },
      ],
    });

    const schedule = model.toEntity().priceTierSchedule!;
    expect(schedule.tierMode).toBe(TierMode.GRADUATED);
    expect(schedule.tierCount).toBe(2);
    expect(schedule.tiers[0].minQty).toBe(1.5);
    expect(schedule.tiers[0].unitPrice).toBe(9_500);
  });
});

describe("VariantForSaleModel — the POS projection uses the same parser", () => {
  it("yields a null schedule when the key is absent", () => {
    const model = VariantForSaleModel.fromJson({ id: "v1", name: "Default", price: 10_000 });

    expect(model.toEntity().priceTierSchedule).toBeNull();
  });

  it("yields a hydrated empty schedule when the array is empty", () => {
    const model = VariantForSaleModel.fromJson({ id: "v1", name: "Default", price: 10_000, price_tiers: [] });

    const schedule = model.toEntity().priceTierSchedule;
    expect(schedule).not.toBeNull();
    expect(schedule!.hasTiers).toBe(false);
  });
});
