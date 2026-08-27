import { DateTime } from "luxon";

/**
 * Format the active date-range filter as a readable label for the FilterPill. Returns the
 * literal "Semua periode" when either bound is `undefined` — mirrors
 * `cost-valuation-gaps/_utils/format-date.ts::formatGapRange`. No `.setZone()`: these are
 * date-picker calendar days, not timestamps.
 */
export function formatCashEntryRange(range: { from: Date | undefined; to: Date | undefined }): string {
  if (!range.from || !range.to) return "Semua periode";
  const from = DateTime.fromJSDate(range.from).toFormat("d MMM yyyy", { locale: "id" });
  const to = DateTime.fromJSDate(range.to).toFormat("d MMM yyyy", { locale: "id" });
  return `${from} – ${to}`;
}
