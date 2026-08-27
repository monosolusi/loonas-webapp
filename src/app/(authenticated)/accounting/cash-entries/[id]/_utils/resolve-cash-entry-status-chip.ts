import { StatusChipVariant } from "@/core/presentations/components/status-chip";
import { CashEntryStatus } from "@/features/accounting/domain/enums/cash-entry-status";

export type CashEntryStatusChip = {
  label: string;
  variant: StatusChipVariant;
};

/**
 * Exhaustive switch over `CashEntryStatus` — a new status is a type error here rather than a
 * blank chip.
 */
export function resolveCashEntryStatusChip(status: CashEntryStatus): CashEntryStatusChip {
  switch (status) {
    case CashEntryStatus.Active:
      return { label: "Aktif", variant: "success" };
    case CashEntryStatus.Cancelled:
      return { label: "Dibatalkan", variant: "neutral" };
    case CashEntryStatus.Cancellation:
      return { label: "Pembatalan", variant: "warning" };
  }
}
