import { describe, expect, it } from "vitest";
import { resolveRowAction } from "@/app/(pos)/pos/_utils/resolve-row-action";
import { DEFAULT_VARIANT_NAME } from "@/features/product/domain/constants/default-variant";
import { ProductForSaleEntity } from "@/features/product/domain/entities/product-for-sale";
import { VariantForSaleEntity } from "@/features/product/domain/entities/variant-for-sale";
import { StockStatus } from "@/features/product/domain/enums/stock-status";
import { UnavailableReason } from "@/features/product/domain/enums/unavailable-reason";

function variant(args: {
  id: string;
  name?: string;
  isAvailable?: boolean;
  stockStatus?: StockStatus;
}): VariantForSaleEntity {
  const isAvailable = args.isAvailable ?? true;
  return new VariantForSaleEntity({
    id: args.id,
    name: args.name ?? DEFAULT_VARIANT_NAME,
    sku: null,
    price: 10_000,
    isAvailable,
    unavailableReason: isAvailable ? null : UnavailableReason.STOCK_NOT_REGISTERED,
    stockStatus: args.stockStatus ?? StockStatus.IN_STOCK,
    currentStock: null,
    maxMakeable: null,
    priceTierSchedule: null,
  });
}

function product(args: { id: string; variants: VariantForSaleEntity[] }): ProductForSaleEntity {
  return new ProductForSaleEntity({
    id: args.id,
    name: "Produk",
    sku: "PRD-1",
    type: "TRADING",
    productionMode: null,
    category: null,
    photos: [],
    variants: args.variants,
    createdAt: "2026-01-01T00:00:00.000Z",
    updatedAt: "2026-01-01T00:00:00.000Z",
  });
}

describe("resolveRowAction", () => {
  describe("variant target", () => {
    it("adds an available variant", () => {
      const v1 = variant({ id: "v1" });
      const p1 = product({ id: "p1", variants: [v1] });

      expect(resolveRowAction({ kind: "variant", product: p1, variant: v1 })).toEqual({
        action: "add",
        product: p1,
        variant: v1,
      });
    });

    it("refuses an unavailable variant", () => {
      const v1 = variant({ id: "v1", isAvailable: false });
      const p1 = product({ id: "p1", variants: [v1] });

      expect(resolveRowAction({ kind: "variant", product: p1, variant: v1 })).toEqual({ action: "noop" });
    });

    it("adds a variant that is merely out of stock — isAvailable is the only gate", () => {
      // `stockStatus` is advisory display data; the server owns sellability via `isAvailable`.
      // Re-deriving the gate from stock would block sales the backend has explicitly allowed
      // (negative-stock selling is a supported flow).
      const v1 = variant({ id: "v1", isAvailable: true, stockStatus: StockStatus.OUT_OF_STOCK });
      const p1 = product({ id: "p1", variants: [v1] });

      expect(resolveRowAction({ kind: "variant", product: p1, variant: v1 })).toEqual({
        action: "add",
        product: p1,
        variant: v1,
      });
    });
  });

  describe("product target", () => {
    it("adds the sole variant of a single-variant product", () => {
      const v1 = variant({ id: "v1" });
      const p1 = product({ id: "p1", variants: [v1] });

      expect(resolveRowAction({ kind: "product", product: p1 })).toEqual({
        action: "add",
        product: p1,
        variant: v1,
      });
    });

    it("drills down into a multi-variant product instead of adding one", () => {
      const p1 = product({
        id: "p1",
        variants: [variant({ id: "v1", name: "Merah" }), variant({ id: "v2", name: "Biru" })],
      });

      expect(resolveRowAction({ kind: "product", product: p1 })).toEqual({ action: "drilldown", product: p1 });
    });

    it("still drills down when only some variants are available", () => {
      const p1 = product({
        id: "p1",
        variants: [
          variant({ id: "v1", name: "Merah", isAvailable: false }),
          variant({ id: "v2", name: "Biru", isAvailable: true }),
        ],
      });

      expect(resolveRowAction({ kind: "product", product: p1 })).toEqual({ action: "drilldown", product: p1 });
    });

    it("refuses a single-variant product whose only variant is unavailable", () => {
      const p1 = product({ id: "p1", variants: [variant({ id: "v1", isAvailable: false })] });

      expect(resolveRowAction({ kind: "product", product: p1 })).toEqual({ action: "noop" });
    });

    it("refuses a multi-variant product with no available variant", () => {
      const p1 = product({
        id: "p1",
        variants: [
          variant({ id: "v1", name: "Merah", isAvailable: false }),
          variant({ id: "v2", name: "Biru", isAvailable: false }),
        ],
      });

      expect(resolveRowAction({ kind: "product", product: p1 })).toEqual({ action: "noop" });
    });

    it("refuses a product with no variants at all", () => {
      const p1 = product({ id: "p1", variants: [] });

      expect(resolveRowAction({ kind: "product", product: p1 })).toEqual({ action: "noop" });
    });
  });
});
