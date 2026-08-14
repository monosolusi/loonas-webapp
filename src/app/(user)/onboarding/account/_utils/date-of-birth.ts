import { DateTime } from "luxon";
import { MINIMUM_ACCOUNT_HOLDER_AGE_YEARS } from "@/features/account/domain/constants/identity-field-limits";

/**
 * Raw three-part form buffer for a birth date, as picked across the day / month / year
 * selects. Each part is independently optional — nothing downstream may fabricate a
 * missing component (see LNS onboarding QA finding F2: partial picks used to silently
 * default to 1 Januari of the current year).
 */
export type DateOfBirthParts = {
  day?: number;
  month?: number;
  year?: number;
};

/**
 * Discriminated outcome of resolving `DateOfBirthParts` into a real, age-eligible date.
 * - `empty` — nothing picked yet.
 * - `incomplete` — 1 or 2 of the 3 parts picked.
 * - `invalid` — all 3 parts picked but they don't form a real calendar date (e.g. 31 Februari).
 * - `underage` — a real date, but younger than `MINIMUM_ACCOUNT_HOLDER_AGE_YEARS` as of `now`.
 * - `valid` — a real, age-eligible date.
 */
export type DateOfBirthResolution =
  | { status: "empty" }
  | { status: "incomplete" }
  | { status: "invalid" }
  | { status: "underage" }
  | { status: "valid"; value: DateTime };

/** Earliest selectable birth year in the year dropdown. */
export const EARLIEST_SELECTABLE_YEAR = 1900;

/**
 * A leap year, used to probe days-in-month when the year hasn't been picked yet, so a
 * 29 Februari birthday stays selectable in the day list until the year narrows it down.
 */
const LEAP_YEAR_PROBE = 2000;

/** Latest selectable birth year — the year that makes someone exactly the minimum age today. */
export function latestSelectableYear(now: DateTime = DateTime.now()): number {
  return now.year - MINIMUM_ACCOUNT_HOLDER_AGE_YEARS;
}

/**
 * Number of days in the given month/year combination, for populating the day select.
 * Falls back to 31 when the month isn't picked yet, and to `LEAP_YEAR_PROBE` when the
 * year isn't picked yet, so the option list never hides a day that could still be valid.
 */
export function daysInMonth(month: number | undefined, year: number | undefined): number {
  if (!month) return 31;
  const probeYear = year ?? LEAP_YEAR_PROBE;
  return DateTime.local(probeYear, month).daysInMonth ?? 31;
}

/**
 * Resolves the three independently-optional day/month/year parts into a single outcome.
 * It is structurally impossible for this function to invent a missing component: with
 * fewer than 3 parts picked, it returns `empty`/`incomplete` and never touches Luxon.
 *
 * `now` is injected (defaulting to `DateTime.now()`) so age-floor checks are deterministic
 * in tests instead of depending on wall-clock time.
 */
export function resolveDateOfBirth(parts: DateOfBirthParts, now: DateTime = DateTime.now()): DateOfBirthResolution {
  const { day, month, year } = parts;
  const filledCount = [day, month, year].filter((part) => part !== undefined).length;

  if (filledCount === 0) return { status: "empty" };
  if (filledCount < 3) return { status: "incomplete" };

  const value = DateTime.local(year!, month!, day!);
  if (!value.isValid) return { status: "invalid" };

  // Exact-birthday comparison, not a year subtraction: someone whose birthday hasn't
  // happened yet this year is still one year younger than `now.year - value.year`.
  const cutoff = now.minus({ years: MINIMUM_ACCOUNT_HOLDER_AGE_YEARS });
  if (value.toMillis() > cutoff.toMillis()) return { status: "underage" };

  return { status: "valid", value };
}

export type DateOfBirthErrorCopyParams = {
  resolution: DateOfBirthResolution;
  /**
   * True the moment a month/year change has just cleared an out-of-range day (e.g.
   * 31 → Februari). This is feedback about an edit the user just made, not a submit-time
   * validation error, so it is NOT gated by `showError` — it takes precedence over every
   * other message.
   */
  dayWasCleared: boolean;
  /** Whether submit-time validation copy (incomplete/invalid/underage) may be shown yet —
   * typically `isTouched || submitAttempted`. */
  showError: boolean;
};

/**
 * Single source of truth for the birth-date field's inline error copy. Precedence:
 * the day-cleared message always wins (immediate, ungated); otherwise nothing renders
 * until `showError`; otherwise the resolution's status maps to its copy 1:1.
 */
export function dateOfBirthErrorCopy(params: DateOfBirthErrorCopyParams): string | undefined {
  const { resolution, dayWasCleared, showError } = params;

  if (dayWasCleared) return "Tanggal tidak tersedia untuk bulan yang dipilih, silakan pilih ulang";
  if (!showError) return undefined;

  switch (resolution.status) {
    case "incomplete":
      return "Lengkapi tanggal, bulan, dan tahun lahir";
    case "invalid":
      return "Tanggal lahir tidak valid";
    case "underage":
      return "Usia minimal 17 tahun untuk membuka akun";
    case "empty":
    case "valid":
      return undefined;
  }
}
