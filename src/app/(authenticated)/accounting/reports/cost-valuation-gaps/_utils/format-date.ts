import { DateTime } from "luxon";

/**
 * Format an ISO date string for the cost-valuation-gaps report.
 * `null` (API omission) and empty string render as an em-dash so an omission is
 * visible rather than indistinguishable from a genuine no-date row.
 */
export function formatGapDate(iso: string | null): string {
  if (!iso) return "—";
  return DateTime.fromISO(iso).toFormat("d MMM yyyy", { locale: "id" });
}

/**
 * Format the active date-range filter as a readable label for the FilterPill.
 * Returns "Semua periode" when no filter is active (both dates undefined).
 */
export function formatGapRange(range: { from: Date | undefined; to: Date | undefined }): string {
  if (!range.from || !range.to) return "Semua periode";
  const from = DateTime.fromJSDate(range.from).toFormat("d MMM yyyy", { locale: "id" });
  const to = DateTime.fromJSDate(range.to).toFormat("d MMM yyyy", { locale: "id" });
  return `${from} – ${to}`;
}