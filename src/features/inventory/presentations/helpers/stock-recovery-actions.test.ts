import { describe, expect, it } from "vitest";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { StockItemType } from "@/features/inventory/domain/enums/stock-item-type";
import {
  stockRecoveryActions,
  stockRecoveryPathsLabel,
} from "@/features/inventory/presentations/helpers/stock-recovery-actions";

function buildStockItem(type: string): StockItemEntity {
  return new StockItemEntity({
    id: "stock-item-1",
    type,
    rawMaterial: null,
    variant: { id: "variant-1", name: "Reguler", productName: "Kopi Susu", sku: "KS-001" },
    currentStock: -3,
    minStock: null,
    createdAt: "2026-08-01T00:00:00Z",
    updatedAt: "2026-08-01T00:00:00Z",
  });
}

// One owner for "how does this item recover from a negative balance" — the
// blocked dialog, the negative-stock list and the stock-adjustment list all read
// it here rather than re-deriving from `type`.
describe("stockRecoveryActions", () => {
  it("offers production before purchasing for finished goods", () => {
    expect(stockRecoveryActions(buildStockItem(StockItemType.FINISHED_GOODS))).toEqual([
      { label: "Catat Produksi", href: "/productions/create" },
      { label: "Catat Pembelian", href: "/purchasing/create" },
    ]);
  });

  it("offers purchasing alone for a raw material", () => {
    expect(stockRecoveryActions(buildStockItem(StockItemType.RAW_MATERIAL))).toEqual([
      { label: "Catat Pembelian", href: "/purchasing/create" },
    ]);
  });

  it("offers purchasing alone for an unrecognised type", () => {
    expect(stockRecoveryActions(buildStockItem("consignment"))).toEqual([
      { label: "Catat Pembelian", href: "/purchasing/create" },
    ]);
  });

  it("falls back to purchasing alone when there is no item", () => {
    expect(stockRecoveryActions(null)).toEqual([{ label: "Catat Pembelian", href: "/purchasing/create" }]);
  });

  it("always ends with purchasing so the last action is the primary affordance", () => {
    for (const type of [StockItemType.FINISHED_GOODS, StockItemType.RAW_MATERIAL]) {
      const actions = stockRecoveryActions(buildStockItem(type));
      expect(actions[actions.length - 1].label).toBe("Catat Pembelian");
    }
  });
});

describe("stockRecoveryPathsLabel", () => {
  it("names both paths for finished goods", () => {
    expect(stockRecoveryPathsLabel(buildStockItem(StockItemType.FINISHED_GOODS))).toBe("pembelian atau produksi");
  });

  it("names purchasing alone for a raw material", () => {
    expect(stockRecoveryPathsLabel(buildStockItem(StockItemType.RAW_MATERIAL))).toBe("pembelian");
  });

  it("names purchasing alone when there is no item", () => {
    expect(stockRecoveryPathsLabel(null)).toBe("pembelian");
  });
});
