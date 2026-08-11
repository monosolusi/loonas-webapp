import { describe, expect, it } from "vitest";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";

function buildStockItem(currentStock: number): StockItemEntity {
  return new StockItemEntity({
    id: "stock-item-1",
    type: "finished_goods",
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
