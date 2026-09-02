import { StatusChipVariant } from "@/core/presentations/components/status-chip";
import { CashEntryStatus } from "@/features/accounting/domain/enums/cash-entry-status";

export type CashEntryStatusChip = {
  label: string;
  variant: StatusChipVariant;
};

export type CashEntryStatusChipResult = { kind: "none" } | { kind: "chip"; chip: CashEntryStatusChip };

/**
 * Exhaustive switch over `CashEntryStatus` — a new status is a type error here rather than a
 * blank chip.
 *
 * Active resolves to `{ kind: "none" }` rather than a chip: absence = active, matching the
 * journals list (`journal-row.tsx`), which carries no status marker at all and surfaces
 * exceptional state only via the cross-reference card. A permanent green "Aktif" chip on every
 * row of a healthy ledger communicated only "not cancelled" with no legend explaining it — so
 * only the two exceptional statuses (Cancelled / Cancellation) render a chip.
 */
export function resolveCashEntryStatusChip(status: CashEntryStatus): CashEntryStatusChipResult {
  switch (status) {
    case CashEntryStatus.Active:
      return { kind: "none" };
    case CashEntryStatus.Cancelled:
      return { kind: "chip", chip: { label: "Dibatalkan", variant: "neutral" } };
    case CashEntryStatus.Cancellation:
      return { kind: "chip", chip: { label: "Pembatalan", variant: "warning" } };
  }
}
