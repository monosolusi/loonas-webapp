import { StatusChipVariant } from "@/core/presentations/components/status-chip";
import { UnavailableReason } from "@/features/product/domain/enums/unavailable-reason";
import { StockStatus } from "@/features/product/domain/enums/stock-status";

const SHORT_LABELS: Record<UnavailableReason, string> = {
  STOCK_NOT_REGISTERED: "Setup",
  RECIPE_NOT_DEFINED: "Resep",
  RAW_MATERIAL_NOT_REGISTERED: "Bahan",
};

const VARIANTS: Record<UnavailableReason, StatusChipVariant> = {
  STOCK_NOT_REGISTERED: "error",
  RECIPE_NOT_DEFINED: "error",
  RAW_MATERIAL_NOT_REGISTERED: "error",
};

export function unavailableShortLabel(reason: UnavailableReason): string {
  return SHORT_LABELS[reason];
}

export function unavailableChipVariant(reason: UnavailableReason): StatusChipVariant {
  return VARIANTS[reason];
}

// Out-of-stock is an advisory signal carried by `stock_status`, not an availability gate — the
// variant stays sellable, so its badge is a warning chip shown on an enabled control, visually
// distinct from the red error chip + disabled state used for the unsellable misconfiguration
// reasons above. Only `OUT_OF_STOCK` renders a badge; the other statuses render nothing.
export function outOfStockBadgeProps(status: StockStatus): { label: string; variant: StatusChipVariant } | null {
  if (status !== StockStatus.OUT_OF_STOCK) return null;
  return { label: "Habis", variant: "warning" };
}

/** Threshold below which a low-stock dot is shown next to the price. */
export const LOW_STOCK_THRESHOLD = 5;
