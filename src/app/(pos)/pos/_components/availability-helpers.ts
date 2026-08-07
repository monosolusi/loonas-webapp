import { StatusChipVariant } from "@/core/presentations/components/status-chip";
import { UnavailableReason } from "@/features/product/domain/enums/unavailable-reason";

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

/** Threshold below which a low-stock dot is shown next to the price. */
export const LOW_STOCK_THRESHOLD = 5;
