import { DateTime } from "luxon";

const TZ_SUFFIX_MAP: Record<string, string> = {
  "Asia/Jakarta": "WIB",
  "Asia/Makassar": "WITA",
  "Asia/Jayapura": "WIT",
};

/**
 * Formats a Luxon DateTime into the POS receipt display format with an Indonesian timezone suffix.
 * Example output: "2 Jun 2026, 14:32 WIB"
 *
 * - Invalid DateTime → returns "".
 * - Unknown timezone → returns the formatted date without a suffix.
 */
export function formatPosReceiptDateTime(dt: DateTime, storeTimezone: string): string {
  if (!dt.isValid) return "";

  const zoned = dt.setZone(storeTimezone).setLocale("id-ID");
  const base = zoned.toFormat("d LLL yyyy, HH:mm");

  const suffix = TZ_SUFFIX_MAP[storeTimezone];
  return suffix ? `${base} ${suffix}` : base;
}
