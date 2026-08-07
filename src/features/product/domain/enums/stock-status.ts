/**
 * Advisory stock-level signal on `ProductForSaleVariant`, always present and never null.
 *
 * Does NOT gate availability — `OUT_OF_STOCK` does not prevent a sale (see `POST /pos/sales`,
 * which is never rejected for insufficient stock). Check `VariantForSaleEntity.isAvailable`
 * for sellability instead; use `stockStatus` only for stock-level display.
 *
 * `IN_STOCK` / `OUT_OF_STOCK` — the variant's balance (or, for an on-demand variant, its
 * derived capacity) is positive or non-positive respectively. `NOT_TRACKED` — a service
 * product, which carries no stock balance. `UNKNOWN` — a configuration gap (the same
 * condition that sets `is_available: false`) or a variant whose stock could not be evaluated.
 */
export const StockStatus = {
  IN_STOCK: "IN_STOCK",
  OUT_OF_STOCK: "OUT_OF_STOCK",
  NOT_TRACKED: "NOT_TRACKED",
  UNKNOWN: "UNKNOWN",
} as const;

export type StockStatus = (typeof StockStatus)[keyof typeof StockStatus];