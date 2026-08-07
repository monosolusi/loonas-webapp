import { StatusChip } from "@/core/presentations/components/status-chip";
import { StockStatus } from "@/features/product/domain/enums/stock-status";
import { outOfStockBadgeProps } from "@/app/(pos)/pos/_components/availability-helpers";

type OutOfStockBadgeProps = {
  status: StockStatus;
};

/**
 * Advisory "Habis" badge for a variant whose `stock_status` is `OUT_OF_STOCK`. The variant
 * remains sellable, so this is a warning chip on an enabled control — distinct from
 * `UnavailableBadge`, which marks unsellable misconfiguration. Returns null for every other
 * `stock_status`, so it is safe to render unconditionally on the available path.
 */
export function OutOfStockBadge({ status }: OutOfStockBadgeProps) {
  const badge = outOfStockBadgeProps(status);
  if (!badge) return null;
  return <StatusChip label={badge.label} variant={badge.variant} compact />;
}