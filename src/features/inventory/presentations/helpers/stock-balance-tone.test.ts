import { describe, expect, it } from "vitest";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { StockItemType } from "@/features/inventory/domain/enums/stock-item-type";
import { stockBalanceTone } from "@/features/inventory/presentations/helpers/stock-balance-tone";

function buildStockItem(currentStock: number, minStock: number | null): StockItemEntity {
  return new StockItemEntity({
    id: "stock-item-1",
    type: StockItemType.RAW_MATERIAL,
    rawMaterial: { id: "raw-1", name: "Gula", unit: "gram" },
    variant: null,
    currentStock,
    minStock,
    createdAt: "2026-08-01T00:00:00Z",
    updatedAt: "2026-08-01T00:00:00Z",
  });
}

describe("stockBalanceTone", () => {
  it("is the error tone for a negative balance", () => {
    expect(stockBalanceTone(buildStockItem(-4, null))).toBe("text-error-400");
  });

  it("keeps the error tone when the item is both negative and below minimum", () => {
    // Negative outranks low: the balance is blocked, not merely thin.
    expect(stockBalanceTone(buildStockItem(-4, 10))).toBe("text-error-400");
  });

  it("is the warning tone at or below the minimum", () => {
    expect(stockBalanceTone(buildStockItem(10, 10))).toBe("text-warning-400");
    expect(stockBalanceTone(buildStockItem(3, 10))).toBe("text-warning-400");
  });

  it("is the neutral tone above the minimum", () => {
    expect(stockBalanceTone(buildStockItem(11, 10))).toBe("text-neutral-500");
  });

  it("is the neutral tone at zero when no minimum is set", () => {
    // Zero is adjustable and unremarkable without a minimum to compare against.
    expect(stockBalanceTone(buildStockItem(0, null))).toBe("text-neutral-500");
  });

  it("is the neutral tone when the minimum is zero", () => {
    expect(stockBalanceTone(buildStockItem(0, 0))).toBe("text-neutral-500");
  });
});
