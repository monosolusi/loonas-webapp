import { describe, expect, it } from "vitest";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { StockItemType } from "@/features/inventory/domain/enums/stock-item-type";

function buildStockItem(currentStock: number, type: string = StockItemType.FINISHED_GOODS): StockItemEntity {
  return new StockItemEntity({
    id: "stock-item-1",
    type,
    rawMaterial: null,
    variant: { id: "variant-1", name: "Reguler", productName: "Kopi Susu", sku: "KS-001" },
    currentStock,
    minStock: null,
    createdAt: "2026-08-01T00:00:00Z",
    updatedAt: "2026-08-01T00:00:00Z",
  });
}

// Mirrors the BE rejection order for POST /inventory/stock-items/{id}/adjustments
// rule #2 (422 STOCK_ADJUSTMENT_ON_NEGATIVE_BALANCE): an already-negative
// starting balance blocks adjustment on either channel. Zero is adjustable —
// the spec says the balance must be back "to zero or above".
describe("StockItemEntity.isNegativeBalance", () => {
  it("is true for a negative balance", () => {
    expect(buildStockItem(-5).isNegativeBalance).toBe(true);
  });

  it("is true for a fractional negative balance", () => {
    expect(buildStockItem(-0.5).isNegativeBalance).toBe(true);
  });

  it("is false at the zero boundary — zero is adjustable", () => {
    expect(buildStockItem(0).isNegativeBalance).toBe(false);
  });

  it("is false for a positive balance", () => {
    expect(buildStockItem(12).isNegativeBalance).toBe(false);
  });

  it("is false for a fractional positive balance", () => {
    expect(buildStockItem(0.5).isNegativeBalance).toBe(false);
  });
});

// `type` arrives as a bare string, so the getter is the only place the wire
// value is compared. It drives the production recovery path in the blocked
// adjustment dialog — an unrecognised value must fall back to "not produced"
// rather than offering a CTA that cannot apply.
describe("StockItemEntity.isFinishedGoods", () => {
  it("is true for a finished-goods item", () => {
    expect(buildStockItem(0, StockItemType.FINISHED_GOODS).isFinishedGoods).toBe(true);
  });

  it("is false for a raw material", () => {
    expect(buildStockItem(0, StockItemType.RAW_MATERIAL).isFinishedGoods).toBe(false);
  });

  it("is false for an unrecognised type", () => {
    expect(buildStockItem(0, "consignment").isFinishedGoods).toBe(false);
  });

  it("is false for an empty type", () => {
    expect(buildStockItem(0, "").isFinishedGoods).toBe(false);
  });
});
