import { DateTime } from "luxon";

/**
 * Format `entry_date` (a `format: date` calendar day, already resolved merchant-side) for
 * display. No `.setZone()` — reinterpreting a calendar day against a timezone can shift it to
 * the adjacent day; see `core/utilities/datetime/calendar-date.ts` for the same rule applied to
 * date-picker conversions. Returns "—" for null/unparseable so an omission stays visible.
 */
export function formatEntryDate(iso: string | null): string {
  if (!iso) return "—";
  const dt = DateTime.fromISO(iso);
  if (!dt.isValid) return "—";
  return dt.setLocale("id").toFormat("d MMM yyyy");
}

/**
 * Format a full timestamp (`createdAt`) for display. Mirrors
 * `journal-detail-info-card.tsx`'s `createdAtDisplay` — no `.setZone()`, so it renders in
 * Luxon's default (system/browser-local) zone, same as that precedent.
 */
export function formatTimestamp(iso: string | null): string {
  if (!iso) return "—";
  const dt = DateTime.fromISO(iso);
  if (!dt.isValid) return "—";
  return dt.setLocale("id").toFormat("dd MMM yyyy, HH:mm");
}
