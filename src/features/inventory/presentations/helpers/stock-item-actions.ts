import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";

/**
 * The navigable actions a stock item row can offer, and which ones apply to a
 * given item. Every action is declared exactly once in {@link STOCK_ITEM_ACTION_RULES}
 * — its applicability and whether it recovers a negative balance are facts on
 * that one row, not restated per consumer. The two public functions below are
 * both projections (filters) over that single table, not independently
 * maintained lists:
 *
 * - {@link stockRecoveryActions} — the paths that bring a *negative* balance
 *   back to zero or above. The BE rejects an adjustment outright while the
 *   balance is negative (422 STOCK_ADJUSTMENT_ON_NEGATIVE_BALANCE), so
 *   recording the missing transaction — purchasing always, plus production
 *   for finished goods — is the only way out. A sale is never a recovery
 *   path: it deepens a negative balance, it does not fix one. That fact lives
 *   once, as `recoversNegativeBalance: false` on the sale row.
 * - {@link stockItemNavigationActions} — the uniform row menu every stock
 *   item offers regardless of balance: purchasing, sale, and (finished goods
 *   only) production. "Sesuaikan Stok" is deliberately not part of this list
 *   — it is a callback, not a route, so it belongs to the row that owns the
 *   adjustment dialog state.
 *
 * Because both functions filter the same table in table order, "navigation is
 * always a superset of recovery" and "purchasing always leads" are structural
 * — they hold by construction, not by convention plus test vigilance.
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

/** Finished goods only — see {@link STOCK_ITEM_ACTION_RULES}. */
export const RECORD_PRODUCTION: StockItemAction = { label: "Catat Produksi", href: "/productions/create" };

type StockItemActionRule = {
  readonly action: StockItemAction;
  /** Only offered on finished goods (production restocks finished goods; raw materials are restocked by purchasing alone). */
  readonly finishedGoodsOnly: boolean;
  /** Whether recording this transaction brings a negative balance back to zero or above. */
  readonly recoversNegativeBalance: boolean;
};

/**
 * The single source of truth for stock item actions, in menu order. Both
 * {@link stockRecoveryActions} and {@link stockItemNavigationActions} are
 * filters over this table — add a fourth action here, not in either function.
 */
const STOCK_ITEM_ACTION_RULES: readonly StockItemActionRule[] = [
  { action: RECORD_PURCHASE, finishedGoodsOnly: false, recoversNegativeBalance: true },
  { action: RECORD_SALE, finishedGoodsOnly: false, recoversNegativeBalance: false },
  { action: RECORD_PRODUCTION, finishedGoodsOnly: true, recoversNegativeBalance: true },
];

/** The rules that apply to this item, table order preserved. */
function applicableStockItemActionRules(stockItem: StockItemEntity): StockItemActionRule[] {
  return STOCK_ITEM_ACTION_RULES.filter((rule) => !rule.finishedGoodsOnly || stockItem.isFinishedGoods);
}

/**
 * Every path that recovers a negative balance, purchasing first as the
 * universal one. Never empty, never includes {@link RECORD_SALE}. For
 * surfaces that present the paths uniformly — a button row, the blocked
 * dialog footer.
 */
export function stockRecoveryActions(stockItem: StockItemEntity): StockItemAction[] {
  return applicableStockItemActionRules(stockItem)
    .filter((rule) => rule.recoversNegativeBalance)
    .map((rule) => rule.action);
}

/**
 * Whether {@link RECORD_PRODUCTION} is one of {@link stockRecoveryActions} for
 * this item — a projection over {@link STOCK_ITEM_ACTION_RULES}, not a second
 * spelling of its `finishedGoodsOnly` / `recoversNegativeBalance` facts. For
 * surfaces that present production differently from the other recovery
 * paths — the blocked dialog's inline "atau produksi" link — instead of the
 * uniform list {@link stockRecoveryActions} feeds directly.
 */
export function canRecoverByProduction(stockItem: StockItemEntity): boolean {
  return stockRecoveryActions(stockItem).includes(RECORD_PRODUCTION);
}

/**
 * The uniform row action menu, the same shape on every stock item: purchasing,
 * then sale, then — finished goods only — production. Always a superset of
 * {@link stockRecoveryActions} for the same item.
 */
export function stockItemNavigationActions(stockItem: StockItemEntity): StockItemAction[] {
  return applicableStockItemActionRules(stockItem).map((rule) => rule.action);
}
