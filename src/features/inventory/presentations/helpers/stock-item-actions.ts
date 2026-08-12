import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";

/**
 * The navigable actions a stock item row can offer, and which ones apply to a
 * given item. This module owns two distinct lists that must not be confused:
 *
 * - {@link stockRecoveryActions} — the paths that bring a *negative* balance
 *   back to zero or above. The BE rejects an adjustment outright while the
 *   balance is negative (422 STOCK_ADJUSTMENT_ON_NEGATIVE_BALANCE), so
 *   recording the missing transaction — purchasing always, plus production
 *   for finished goods — is the only way out. A sale is never a recovery
 *   path: it deepens a negative balance, it does not fix one.
 * - {@link stockItemNavigationActions} — the uniform row menu every stock
 *   item offers regardless of balance: purchasing, sale, and (finished goods
 *   only) production. "Sesuaikan Stok" is deliberately not part of this list
 *   — it is a callback, not a route, so it belongs to the row that owns the
 *   adjustment dialog state.
 *
 * This module owns *which* paths apply to an item. Each surface owns *how* it
 * presents them: the blocked dialog demotes production to an inline link and
 * keeps a two-action footer, the form dialog shows a button row, the list
 * rows an action menu. Do not encode a rendering hierarchy here.
 *
 * Presentation layer rather than `domain/helpers/`: the values are user-facing
 * routing — an app route and an Indonesian label.
 */
export type StockItemAction = {
  readonly label: string;
  readonly href: string;
};

/** The recovery path valid for every item type. */
export const RECORD_PURCHASE: StockItemAction = { label: "Catat Pembelian", href: "/purchasing/create" };

/** Never a recovery path — see the module doc comment. */
export const RECORD_SALE: StockItemAction = { label: "Catat Penjualan", href: "/pos" };

/** Finished goods only — see {@link canRecoverByProduction}. */
export const RECORD_PRODUCTION: StockItemAction = { label: "Catat Produksi", href: "/productions/create" };

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
 * Every path that recovers a negative balance, purchasing first as the
 * universal one. Never empty, never includes {@link RECORD_SALE}. For
 * surfaces that present the paths uniformly — a button row, the blocked
 * dialog footer.
 */
export function stockRecoveryActions(stockItem: StockItemEntity): StockItemAction[] {
  if (canRecoverByProduction(stockItem)) return [RECORD_PURCHASE, RECORD_PRODUCTION];
  return [RECORD_PURCHASE];
}

/**
 * The uniform row action menu, the same shape on every stock item: purchasing,
 * then sale, then — finished goods only — production. Always a superset of
 * {@link stockRecoveryActions} for the same item.
 */
export function stockItemNavigationActions(stockItem: StockItemEntity): StockItemAction[] {
  if (canRecoverByProduction(stockItem)) return [RECORD_PURCHASE, RECORD_SALE, RECORD_PRODUCTION];
  return [RECORD_PURCHASE, RECORD_SALE];
}
