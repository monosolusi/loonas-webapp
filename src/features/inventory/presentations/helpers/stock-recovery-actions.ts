import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";

/**
 * How a negative stock balance is brought back to zero or above. The BE rejects
 * an adjustment outright while the balance is negative (422
 * STOCK_ADJUSTMENT_ON_NEGATIVE_BALANCE), so a receipt — purchasing always, plus
 * production for finished goods — is the only way out.
 *
 * These live in the presentation layer, not `domain/helpers/`, because the value
 * includes an app route: where the recovery is recorded is a routing fact, not a
 * domain one.
 */
export type StockRecoveryAction = {
  readonly label: string;
  readonly href: string;
};

const RECORD_PRODUCTION: StockRecoveryAction = { label: "Catat Produksi", href: "/productions/create" };
const RECORD_PURCHASE: StockRecoveryAction = { label: "Catat Pembelian", href: "/purchasing/create" };

/**
 * Ordered least- to most-prominent: consumers render the last action as the
 * primary affordance and any earlier one as a secondary.
 *
 * `null` is accepted because the blocked dialog outlives its item — the item goes
 * null the instant the dialog closes while the panel is still playing its leave
 * transition. Purchasing is the recovery path every stock item shares, so it is
 * the safe floor for an unknown item and keeps the footer stable mid-fade.
 */
export function stockRecoveryActions(stockItem: StockItemEntity | null): StockRecoveryAction[] {
  // Only finished goods are produced; raw materials are restocked by purchasing
  // alone. Routed through the entity getter so no call site re-spells the type
  // comparison.
  if (stockItem?.isFinishedGoods ?? false) return [RECORD_PRODUCTION, RECORD_PURCHASE];
  return [RECORD_PURCHASE];
}

/** Prose form of the same rule, for copy that names the recovery paths inline. */
export function stockRecoveryPathsLabel(stockItem: StockItemEntity | null): string {
  return (stockItem?.isFinishedGoods ?? false) ? "pembelian atau produksi" : "pembelian";
}
