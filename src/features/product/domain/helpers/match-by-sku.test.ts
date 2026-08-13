import { describe, expect, it } from "vitest";
import { DEFAULT_VARIANT_NAME } from "@/features/product/domain/constants/default-variant";
import { ProductForSaleEntity } from "@/features/product/domain/entities/product-for-sale";
import { VariantForSaleEntity } from "@/features/product/domain/entities/variant-for-sale";
import { StockStatus } from "@/features/product/domain/enums/stock-status";
import { matchBySku } from "@/features/product/domain/helpers/match-by-sku";

function variant(args: { id: string; name?: string; sku?: string | null; isAvailable?: boolean }): VariantForSaleEntity {
  return new VariantForSaleEntity({
    id: args.id,
    name: args.name ?? DEFAULT_VARIANT_NAME,
    sku: args.sku === undefined ? null : args.sku,
    price: 10_000,
    isAvailable: args.isAvailable ?? true,
    unavailableReason: null,
    stockStatus: StockStatus.IN_STOCK,
    currentStock: null,
    maxMakeable: null,
    priceTierSchedule: null,
  });
}

function product(args: { id: string; name?: string; sku: string; variants: VariantForSaleEntity[] }): ProductForSaleEntity {
  return new ProductForSaleEntity({
    id: args.id,
    name: args.name ?? "Produk",
    sku: args.sku,
    type: "TRADING",
    productionMode: null,
    category: null,
    photos: [],
    variants: args.variants,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  });
}

describe("matchBySku", () => {
  it("matches an exact variant SKU", () => {
    const v1 = variant({ id: "v1", name: "Merah", sku: "KAOS-MERAH" });
    const v2 = variant({ id: "v2", name: "Biru", sku: "KAOS-BIRU" });
    const p1 = product({ id: "p1", sku: "KAOS", variants: [v1, v2] });

    const result = matchBySku([p1], "KAOS-BIRU");

    expect(result).toEqual({ kind: "variant", product: p1, variant: v2 });
  });

  it("matches an exact product SKU when no variant SKU matches", () => {
    const v1 = variant({ id: "v1", sku: null });
    const p1 = product({ id: "p1", sku: "KOPI-001", variants: [v1] });

    const result = matchBySku([p1], "KOPI-001");

    expect(result).toEqual({ kind: "product", product: p1 });
  });

  it("is case-insensitive and trims whitespace", () => {
    const v1 = variant({ id: "v1", sku: "ABC-123" });
    const p1 = product({ id: "p1", sku: "PRD-1", variants: [v1] });

    expect(matchBySku([p1], "  abc-123  ")).toEqual({ kind: "variant", product: p1, variant: v1 });
    expect(matchBySku([p1], "abc-123")).toEqual({ kind: "variant", product: p1, variant: v1 });
  });

  it("does NOT match a near-miss prefix — the exact-match regression guard", () => {
    const v1 = variant({ id: "v1", sku: null });
    const p1 = product({ id: "p1", sku: "ABC-12", variants: [v1] });

    // "ABC-1" is a strict prefix of "ABC-12" — must not match, or the wrong item gets added.
    expect(matchBySku([p1], "ABC-1")).toEqual({ kind: "none" });
  });

  it("resolves to product for a single-variant product SKU (addable, no drilldown needed)", () => {
    const v1 = variant({ id: "v1", sku: null });
    const p1 = product({ id: "p1", sku: "SATU-VARIAN", variants: [v1] });

    const result = matchBySku([p1], "SATU-VARIAN");

    expect(result.kind).toBe("product");
    if (result.kind === "product") {
      expect(result.product.hasMultipleVariants).toBe(false);
    }
  });

  it("resolves to product for a multi-variant product SKU (caller should drilldown)", () => {
    const v1 = variant({ id: "v1", sku: null });
    const v2 = variant({ id: "v2", sku: null });
    const p1 = product({ id: "p1", sku: "MULTI-VARIAN", variants: [v1, v2] });

    const result = matchBySku([p1], "MULTI-VARIAN");

    expect(result.kind).toBe("product");
    if (result.kind === "product") {
      expect(result.product.hasMultipleVariants).toBe(true);
    }
  });

  it("returns ambiguous when two different products match the same code", () => {
    const p1 = product({ id: "p1", sku: "DUPLICATE", variants: [variant({ id: "v1", sku: null })] });
    const p2 = product({ id: "p2", sku: "DUPLICATE", variants: [variant({ id: "v2", sku: null })] });

    const result = matchBySku([p1, p2], "DUPLICATE");

    expect(result.kind).toBe("ambiguous");
    if (result.kind === "ambiguous") {
      expect(result.products).toEqual([p1, p2]);
    }
  });

  it("returns ambiguous when two different products' variants share the same SKU", () => {
    const p1 = product({ id: "p1", sku: "PRD-1", variants: [variant({ id: "v1", sku: "SHARED" })] });
    const p2 = product({ id: "p2", sku: "PRD-2", variants: [variant({ id: "v2", sku: "SHARED" })] });

    const result = matchBySku([p1, p2], "SHARED");

    expect(result.kind).toBe("ambiguous");
  });

  it("returns ambiguous when two variants of the SAME product share the code", () => {
    // Nothing guarantees SKUs are unique within a product, and picking the first match would
    // silently drop an arbitrary size/colour into the cart with no signal to the cashier.
    const v1 = variant({ id: "v1", name: "Merah", sku: "SHARED" });
    const v2 = variant({ id: "v2", name: "Biru", sku: "SHARED" });
    const p1 = product({ id: "p1", sku: "PRD-1", variants: [v1, v2] });

    const result = matchBySku([p1], "SHARED");

    expect(result.kind).toBe("ambiguous");
    if (result.kind === "ambiguous") {
      expect(result.products).toEqual([p1]);
    }
  });

  it("returns none for an unknown code", () => {
    const p1 = product({ id: "p1", sku: "PRD-1", variants: [variant({ id: "v1", sku: null })] });

    expect(matchBySku([p1], "NOT-FOUND")).toEqual({ kind: "none" });
  });

  it("returns none for a blank or whitespace-only code", () => {
    const p1 = product({ id: "p1", sku: "PRD-1", variants: [variant({ id: "v1", sku: null })] });

    expect(matchBySku([p1], "")).toEqual({ kind: "none" });
    expect(matchBySku([p1], "   ")).toEqual({ kind: "none" });
  });

  it("matches the Default-named variant's parent-SKU fallback (server quirk: null variant SKU falls back to product SKU)", () => {
    // GET /products/for-sale falls back a `Default`-named variant's SKU to the parent
    // product's SKU when its own SKU is null. By the time the entity is hydrated, the
    // variant already carries that SKU value — this test fixes that shape.
    const defaultVariant = variant({ id: "v1", name: DEFAULT_VARIANT_NAME, sku: "PRD-1" });
    const p1 = product({ id: "p1", sku: "PRD-1", variants: [defaultVariant] });

    const result = matchBySku([p1], "PRD-1");

    // Variant-level match takes precedence over the product-level match, even though both
    // carry the same SKU value here.
    expect(result).toEqual({ kind: "variant", product: p1, variant: defaultVariant });
  });

  it("prefers a variant match over a product match on the same product", () => {
    const v1 = variant({ id: "v1", sku: "PRD-1" });
    const p1 = product({ id: "p1", sku: "PRD-1", variants: [v1] });

    const result = matchBySku([p1], "PRD-1");

    expect(result).toEqual({ kind: "variant", product: p1, variant: v1 });
  });
});
