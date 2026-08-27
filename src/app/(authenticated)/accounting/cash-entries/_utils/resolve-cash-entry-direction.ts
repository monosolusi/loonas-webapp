import { CashEntryEntity } from "@/features/accounting/domain/entities/cash-entry";

export type CashEntryDirectionLabel = {
  label: "Kas Masuk" | "Kas Keluar";
};

/**
 * Pure `CashEntryEntity → direction label`, derived from `entry.isMoneyIn` (which itself reads
 * `entry.direction`, never `entry.category.direction`). On a `status: "cancellation"` row the
 * category's own `direction` is the OPPOSITE of the entry's — see `CashEntryCategory`'s doc
 * comment and LNS-762 — so this must never re-derive the label from the category.
 */
export function resolveCashEntryDirection(entry: CashEntryEntity): CashEntryDirectionLabel {
  return { label: entry.isMoneyIn ? "Kas Masuk" : "Kas Keluar" };
}
