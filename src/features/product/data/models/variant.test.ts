import { describe, expect, it } from "vitest";
import { VariantModel } from "@/features/product/data/models/variant";
import { VariantForSaleModel } from "@/features/product/data/models/variant-for-sale";
import { TierMode } from "@/features/product/domain/enums/tier-mode";
import { StockStatus } from "@/features/product/domain/enums/stock-status";
import { UnavailableReason } from "@/features/product/domain/enums/unavailable-reason";

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

/**
 * LNS-608 — `stock_status` is the advisory, always-present stock-level signal the POS picker
 * shows an out-of-stock badge from. `OUT_OF_STOCK` is no longer a member of `unavailable_reason`
 * (a stock shortfall no longer makes a variant unsellable), so the parser must drop it there
 * while the new field carries it.
 */
describe("VariantForSaleModel — stock_status + unavailable_reason contract change", () => {
  it.each([
    ["IN_STOCK", StockStatus.IN_STOCK],
    ["OUT_OF_STOCK", StockStatus.OUT_OF_STOCK],
    ["NOT_TRACKED", StockStatus.NOT_TRACKED],
    ["UNKNOWN", StockStatus.UNKNOWN],
  ])("parses stock_status %s and round-trips it through toEntity", (raw, expected) => {
    const model = VariantForSaleModel.fromJson({ id: "v1", name: "Default", price: 10_000, stock_status: raw });

    expect(model.stockStatus).toBe(expected);
    expect(model.toEntity().stockStatus).toBe(expected);
  });

  it("defaults a missing or non-string stock_status to UNKNOWN (spec promises always-present)", () => {
    expect(VariantForSaleModel.fromJson({ id: "v1", name: "Default", price: 10_000 }).stockStatus).toBe(
      StockStatus.UNKNOWN,
    );
    expect(VariantForSaleModel.fromJson({ id: "v1", name: "Default", price: 10_000, stock_status: 7 }).stockStatus).toBe(
      StockStatus.UNKNOWN,
    );
    expect(
      VariantForSaleModel.fromJson({ id: "v1", name: "Default", price: 10_000, stock_status: "BOGUS" }).stockStatus,
    ).toBe(StockStatus.UNKNOWN);
  });

  it("derives isOutOfStock only from OUT_OF_STOCK, not from current_stock sign", () => {
    const out = VariantForSaleModel.fromJson({
      id: "v1",
      name: "Default",
      price: 10_000,
      stock_status: "OUT_OF_STOCK",
      current_stock: -3,
    }).toEntity();
    const inStock = VariantForSaleModel.fromJson({
      id: "v1",
      name: "Default",
      price: 10_000,
      stock_status: "IN_STOCK",
      current_stock: 0,
    }).toEntity();

    expect(out.isOutOfStock).toBe(true);
    // A zero balance with IN_STOCK is NOT out of stock — the server owns that call, the FE does not re-derive.
    expect(inStock.isOutOfStock).toBe(false);
  });

  it("treats a negative current_stock as a plain number (no NaN, no clamp)", () => {
    const model = VariantForSaleModel.fromJson({
      id: "v1",
      name: "Default",
      price: 10_000,
      stock_status: "OUT_OF_STOCK",
      current_stock: -5,
    });

    expect(model.currentStock).toBe(-5);
    expect(model.toEntity().currentStock).toBe(-5);
  });

  it("no longer treats OUT_OF_STOCK as an unavailable_reason (it is parsed to null there)", () => {
    const model = VariantForSaleModel.fromJson({
      id: "v1",
      name: "Default",
      price: 10_000,
      is_available: true,
      unavailable_reason: "OUT_OF_STOCK",
      stock_status: "OUT_OF_STOCK",
    });

    // OUT_OF_STOCK is gone from the UnavailableReason union, so the parser drops it.
    expect(model.unavailableReason).toBeNull();
    expect(model.toEntity().unavailableReason).toBeNull();
    // The union no longer carries OUT_OF_STOCK at all.
    expect(Object.values(UnavailableReason)).not.toContain("OUT_OF_STOCK");
  });

  it("still parses the three misconfiguration unavailable_reasons", () => {
    for (const reason of [
      "STOCK_NOT_REGISTERED",
      "RAW_MATERIAL_NOT_REGISTERED",
      "RECIPE_NOT_DEFINED",
    ] as const) {
      const model = VariantForSaleModel.fromJson({
        id: "v1",
        name: "Default",
        price: 10_000,
        is_available: false,
        unavailable_reason: reason,
        stock_status: "UNKNOWN",
      });

      expect(model.unavailableReason).toBe(reason);
    }
  });
});
