import { describe, expect, it } from "vitest";
import { InvoiceItemModel } from "@/features/invoice/data/models/invoice-item";
import { isTierPricedItem } from "@/features/invoice/domain/guards/invoice-guards";
import { PriceSource } from "@/features/invoice/domain/enums/price-source";

function itemJson(overrides: Record<string, any> = {}) {
  return {
    id: "i1",
    name: "Beras Premium 5kg",
    qty: 12,
    price: 9_000,
    tax_type: "none",
    tax_base: 0,
    tax: 0,
    total: 108_000,
    created_at: new Date("2026-01-01"),
    updated_at: new Date("2026-01-01"),
    ...overrides,
  };
}

describe("InvoiceItemModel — tier snapshot parsing", () => {
  it("parses the four tier fields when present", () => {
    const item = InvoiceItemModel.fromJson(
      itemJson({
        amount_before_tax: 108_000,
        price_source: "tier",
        applied_tier_min_qty: 10,
        list_price: 10_000,
      }),
    ).toEntity();

    expect(item.amountBeforeTax).toBe(108_000);
    expect(item.priceSource).toBe(PriceSource.TIER);
    expect(item.appliedTierMinQty).toBe(10);
    expect(item.listPrice).toBe(10_000);
  });

  // AC-25 — a null field must be omitted, not rendered as 0. `Number(null)` is 0, which
  // would print a "mulai 0" bracket on a base-priced line and read as a real tier.
  it("preserves null rather than coercing it to zero", () => {
    const item = InvoiceItemModel.fromJson(
      itemJson({ price_source: "base", applied_tier_min_qty: null, list_price: null }),
    ).toEntity();

    expect(item.appliedTierMinQty).toBeNull();
    expect(item.listPrice).toBeNull();
    expect(item.appliedTierMinQty).not.toBe(0);
  });

  it("yields null for absent tier fields on a B2B line", () => {
    const item = InvoiceItemModel.fromJson(itemJson()).toEntity();

    expect(item.amountBeforeTax).toBeNull();
    expect(item.priceSource).toBeNull();
    expect(item.appliedTierMinQty).toBeNull();
    expect(item.listPrice).toBeNull();
  });

  it("rejects an unrecognised price_source rather than trusting it", () => {
    const item = InvoiceItemModel.fromJson(itemJson({ price_source: "wholesale" })).toEntity();

    expect(item.priceSource).toBeNull();
    expect(isTierPricedItem(item)).toBe(false);
  });
});

describe("isTierPricedItem — AC-24", () => {
  // The determination must read price_source. A tier priced equal to the list price
  // compares equal, so a price-vs-listPrice comparison would call it base-priced.
  it("reports a tier line whose price equals the list price as tier-priced", () => {
    const item = InvoiceItemModel.fromJson(
      itemJson({
        price: 10_000,
        list_price: 10_000,
        price_source: "tier",
        applied_tier_min_qty: 10,
        amount_before_tax: 120_000,
      }),
    ).toEntity();

    expect(item.price).toBe(item.listPrice);
    expect(isTierPricedItem(item)).toBe(true);
  });

  it("reports a base line as base-priced even though list_price is populated", () => {
    // list_price is populated on EVERY POS line, tiered or not — on a base-priced line
    // it equals price. It is not null-when-base.
    const item = InvoiceItemModel.fromJson(
      itemJson({ price: 10_000, list_price: 10_000, price_source: "base", applied_tier_min_qty: null }),
    ).toEntity();

    expect(item.listPrice).toBe(10_000);
    expect(isTierPricedItem(item)).toBe(false);
  });
});

describe("InvoiceItemModel — AC-26 whole rupiah", () => {
  it("passes amounts through with no minor-unit conversion", () => {
    const item = InvoiceItemModel.fromJson(
      itemJson({ price: 25_000, amount_before_tax: 25_000, list_price: 25_000, total: 25_000 }),
    ).toEntity();

    // A stray /100 would yield 250; a stray *100 would yield 2.500.000.
    expect(item.price).toBe(25_000);
    expect(item.amountBeforeTax).toBe(25_000);
    expect(item.listPrice).toBe(25_000);
  });
});
