import { StatusChip } from "@/core/presentations/components/status-chip";

type OutOfStockBadgeProps = {
  isOutOfStock: boolean;
};

/**
 * Advisory "Habis" badge for an out-of-stock variant. The variant remains sellable, so this
 * is a warning chip on an enabled control — distinct from `UnavailableBadge`, which marks
 * unsellable misconfiguration. The predicate comes from `VariantForSaleEntity.isOutOfStock`
 * (display only, never gates saleability); returns null otherwise, so it is safe to render
 * unconditionally on the available path.
 */
export function OutOfStockBadge({ isOutOfStock }: OutOfStockBadgeProps) {
  if (!isOutOfStock) return null;
  return <StatusChip label="Habis" variant="warning" compact />;
}