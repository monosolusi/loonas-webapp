import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";

/**
 * Text tone for the "Stok Terkini" cell, shared by every stock item list
 * (Penyesuaian Stok, Stok Negatif). Three states, so it lives outside the
 * `.tsx` where the Vitest node suite can lock the precedence: a negative balance
 * is the blocked state and outranks low stock, low stock is a warning, and every
 * other balance is ordinary.
 *
 * Both predicates are read off the entity — the thresholds stay owned by
 * `StockItemEntity`, never re-derived from `currentStock` / `minStock` here.
 */
export type StockBalanceTone = "text-error-400" | "text-warning-400" | "text-neutral-500";

export function stockBalanceTone(stockItem: StockItemEntity): StockBalanceTone {
  if (stockItem.isNegativeBalance) return "text-error-400";
  if (stockItem.isLowStock) return "text-warning-400";
  return "text-neutral-500";
}
