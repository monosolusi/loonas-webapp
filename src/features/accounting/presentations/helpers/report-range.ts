import { DateTime } from "luxon";

export type DateRange = { from: Date | undefined; to: Date | undefined };

/**
 * Validates a date range for report fetching:
 * - Both from and to must be defined
 * - Both must be in the same year
 * - from must be <= to
 */
export function isRangeValid(range: DateRange): boolean {
  if (!range.from || !range.to) return false;
  const from = DateTime.fromJSDate(range.from);
  const to = DateTime.fromJSDate(range.to);
  return from.year === to.year && from <= to;
}

/**
 * Returns default month-to-date range in Asia/Jakarta timezone.
 */
export function getMonthToDateRange(): DateRange {
  const now = DateTime.now().setZone("Asia/Jakarta");
  return {
    from: now.startOf("month").toJSDate(),
    to: now.toJSDate(),
  };
}

/**
 * Formats a Date to yyyy-MM-dd string.
 */
export function toDateString(date: Date): string {
  return DateTime.fromJSDate(date).toFormat("yyyy-MM-dd");
}
