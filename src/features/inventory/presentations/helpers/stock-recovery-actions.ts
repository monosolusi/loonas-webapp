import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";

/**
 * How a negative stock balance is brought back to zero or above. The BE rejects
 * an adjustment outright while the balance is negative (422
 * STOCK_ADJUSTMENT_ON_NEGATIVE_BALANCE), so a receipt — purchasing always, plus
 * production for finished goods — is the only way out.
 *
 * These live in the presentation layer, not `domain/helpers/`, because the
 * values are user-facing routing: an app route and an Indonesian label.
 */
export type StockRecoveryAction = {
  readonly label: string;
  readonly href: string;
};

const RECORD_PRODUCTION: StockRecoveryAction = { label: "Catat Produksi", href: "/productions/create" };
const RECORD_PURCHASE: StockRecoveryAction = { label: "Catat Pembelian", href: "/purchasing/create" };

/**
 * The one rule both exports read. Only finished goods are produced; raw
 * materials are restocked by purchasing alone. Stated once here so the action
 * list and the prose cannot drift apart.
 */
function isProducible(stockItem: StockItemEntity): boolean {
  return stockItem.isFinishedGoods;
}

/**
 * Ordered least- to most-prominent: consumers render the last action as the
 * primary affordance and any earlier one as a secondary. Never empty.
 */
export function stockRecoveryActions(stockItem: StockItemEntity): StockRecoveryAction[] {
  if (isProducible(stockItem)) return [RECORD_PRODUCTION, RECORD_PURCHASE];
  return [RECORD_PURCHASE];
}

/** Prose form of the same rule, for copy that names the recovery paths inline. */
export function stockRecoveryPathsLabel(stockItem: StockItemEntity): string {
  return isProducible(stockItem) ? "pembelian atau produksi" : "pembelian";
}
