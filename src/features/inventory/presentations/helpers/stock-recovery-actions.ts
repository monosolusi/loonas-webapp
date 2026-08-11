import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";

/**
 * How a negative stock balance is brought back to zero or above. The BE rejects
 * an adjustment outright while the balance is negative (422
 * STOCK_ADJUSTMENT_ON_NEGATIVE_BALANCE), so recording the missing transaction —
 * purchasing always, plus production for finished goods — is the only way out.
 *
 * This module owns *which* paths apply to an item. Each surface owns *how* it
 * presents them: the blocked dialog demotes production to an inline link and
 * keeps a two-action footer, the form dialog shows a button row, the list rows
 * an action menu. Do not encode a rendering hierarchy here.
 *
 * Presentation layer rather than `domain/helpers/`: the values are user-facing
 * routing — an app route and an Indonesian label.
 */
export type StockRecoveryAction = {
  readonly label: string;
  readonly href: string;
};

/** The recovery path valid for every item type. */
export const RECORD_PURCHASE: StockRecoveryAction = { label: "Catat Pembelian", href: "/purchasing/create" };

/** Finished goods only — see {@link canRecoverByProduction}. */
export const RECORD_PRODUCTION: StockRecoveryAction = { label: "Catat Produksi", href: "/productions/create" };

/**
 * The one spelling of the rule. Only finished goods are produced; raw materials
 * are restocked by purchasing alone. Surfaces that present production
 * differently from the other paths — an inline link, a conditional button —
 * read this rather than re-deriving from the item type.
 */
export function canRecoverByProduction(stockItem: StockItemEntity): boolean {
  return stockItem.isFinishedGoods;
}

/**
 * Every path that applies, purchasing first as the universal one. Never empty.
 * For surfaces that present the paths uniformly — a button row, an action menu.
 */
export function stockRecoveryActions(stockItem: StockItemEntity): StockRecoveryAction[] {
  if (canRecoverByProduction(stockItem)) return [RECORD_PURCHASE, RECORD_PRODUCTION];
  return [RECORD_PURCHASE];
}
