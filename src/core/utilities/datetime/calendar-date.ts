import { DateTime } from "luxon";

/**
 * Calendar-day conversions for `react-day-picker`, which has no timezone concept — it emits and
 * consumes JS `Date`s at the *browser-local* midnight of the clicked calendar day.
 *
 * These helpers stay in local calendar-day space (no zone reinterpretation), so the ISO date the
 * user applies always equals the day they clicked, on any browser timezone. Reinterpreting the
 * local-midnight instant against Asia/Jakarta (`.setZone("Asia/Jakarta")`) shifts the calendar day
 * back one day for browsers east of UTC+7 (WITA +8, WIT +9) — the off-by-one this replaces.
 */

/** ISO date string (`yyyy-MM-dd`) → browser-local midnight Date. */
export function isoToDate(iso: string): Date {
  return DateTime.fromISO(iso).toJSDate();
}

/** Date → its local calendar day as `yyyy-MM-dd`, i.e. exactly the day the user clicked. */
export function dateToIso(date: Date): string {
  return DateTime.fromJSDate(date).toFormat("yyyy-MM-dd");
}
