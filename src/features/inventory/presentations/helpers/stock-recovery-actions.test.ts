import { describe, expect, it } from "vitest";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { StockItemType } from "@/features/inventory/domain/enums/stock-item-type";
import {
  canRecoverByProduction,
  RECORD_PRODUCTION,
  RECORD_PURCHASE,
  stockRecoveryActions,
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
describe("canRecoverByProduction", () => {
  it("is true for finished goods", () => {
    expect(canRecoverByProduction(buildStockItem(StockItemType.FINISHED_GOODS))).toBe(true);
  });

  it("is false for a raw material", () => {
    expect(canRecoverByProduction(buildStockItem(StockItemType.RAW_MATERIAL))).toBe(false);
  });

  it("is false for an unrecognised type", () => {
    expect(canRecoverByProduction(buildStockItem("consignment"))).toBe(false);
  });
});

describe("stockRecoveryActions", () => {
  it("offers purchasing then production for finished goods", () => {
    expect(stockRecoveryActions(buildStockItem(StockItemType.FINISHED_GOODS))).toEqual([
      RECORD_PURCHASE,
      RECORD_PRODUCTION,
    ]);
  });

  it("offers purchasing alone for a raw material", () => {
    expect(stockRecoveryActions(buildStockItem(StockItemType.RAW_MATERIAL))).toEqual([RECORD_PURCHASE]);
  });

  it("offers purchasing alone for an unrecognised type", () => {
    expect(stockRecoveryActions(buildStockItem("consignment"))).toEqual([RECORD_PURCHASE]);
  });

  it("always leads with purchasing — the path valid for every item type", () => {
    for (const type of ALL_TYPES) {
      expect(stockRecoveryActions(buildStockItem(type))[0]).toBe(RECORD_PURCHASE);
    }
  });

  it("is never empty", () => {
    for (const type of ALL_TYPES) {
      expect(stockRecoveryActions(buildStockItem(type)).length).toBeGreaterThan(0);
    }
  });
});

// The blocked dialog reads the predicate (production as an inline link) while
// the form dialog and both list rows read the action list, so the two
// disagreeing is a visible defect across surfaces. This is the assertion that
// catches the rule being re-derived in one of them.
describe("the predicate and the action list agree", () => {
  it("includes production exactly when production is a valid recovery path", () => {
    for (const type of ALL_TYPES) {
      const stockItem = buildStockItem(type);
      const offersProduction = stockRecoveryActions(stockItem).includes(RECORD_PRODUCTION);
      expect(canRecoverByProduction(stockItem)).toBe(offersProduction);
    }
  });
});
