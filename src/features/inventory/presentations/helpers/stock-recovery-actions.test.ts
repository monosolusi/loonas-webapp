import { describe, expect, it } from "vitest";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { StockItemType } from "@/features/inventory/domain/enums/stock-item-type";
import {
  stockRecoveryActions,
  stockRecoveryPathsLabel,
} from "@/features/inventory/presentations/helpers/stock-recovery-actions";

const ALL_TYPES = [StockItemType.FINISHED_GOODS, StockItemType.RAW_MATERIAL, "consignment", ""];

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
// blocked dialog, the adjustment form dialog, the negative-stock list and the
// stock-adjustment list all read it here rather than re-deriving from `type`.
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

  it("always ends with purchasing so the last action is the primary affordance", () => {
    for (const type of ALL_TYPES) {
      const actions = stockRecoveryActions(buildStockItem(type));
      expect(actions[actions.length - 1].label).toBe("Catat Pembelian");
    }
  });

  it("is never empty — consumers dereference the last element", () => {
    for (const type of ALL_TYPES) {
      expect(stockRecoveryActions(buildStockItem(type)).length).toBeGreaterThan(0);
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

  it("names purchasing alone for an unrecognised type", () => {
    expect(stockRecoveryPathsLabel(buildStockItem("consignment"))).toBe("pembelian");
  });
});

// The blocked dialog renders the prose and the CTAs side by side, so the two
// exports disagreeing is a visible defect. This is the assertion that catches
// the shared predicate being inlined back into one of them.
describe("the two exports agree", () => {
  it("names production exactly when the actions include it", () => {
    for (const type of ALL_TYPES) {
      const stockItem = buildStockItem(type);
      const offersProduction = stockRecoveryActions(stockItem).some((action) => action.label === "Catat Produksi");
      expect(stockRecoveryPathsLabel(stockItem).includes("produksi")).toBe(offersProduction);
    }
  });
});
