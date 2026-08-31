import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";

export type DirectionLabel = "Kas Masuk" | "Kas Keluar";

/**
 * Pure `CashEntryDirection` → Indonesian label, shared by the list rows and the edit dialog's
 * read-only "Arah" field. A category's direction is fixed at create time, so unlike
 * `cash-entries/_utils/resolve-cash-entry-direction.ts` there is no entry-vs-category split to
 * guard — the label always follows the category's own direction.
 */
export function directionLabel(direction: CashEntryDirection): DirectionLabel {
  return direction === CashEntryDirection.In ? "Kas Masuk" : "Kas Keluar";
}
