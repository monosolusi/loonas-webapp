import { PersonalAccountData } from "@/app/(user)/onboarding/account/_utils/account-form-data";
import {
  Nationality,
  identityNumberLabel,
} from "@/app/(user)/onboarding/account/_utils/personal-account-completeness";

/**
 * Resolves a citizenship-radio click into the patch the provider should apply to the personal
 * form buffer, plus whether that patch destroys a previously entered identity number.
 *
 * This is the QA finding F9 fix. The bug: a user who typed their NIK FIRST and only then clicked
 * "WNI" lost the NIK — `nationality-radio-group.tsx`'s old `onChange` cleared `identityNumber` on
 * EVERY checked change, including the very first selection, where `nationality` was moving from
 * `undefined` to a real value and nothing the user had typed had become invalid.
 *
 * Why the clear is still load-bearing for a REAL switch (WNI<->WNA): `PASSPORT_PATTERN` is
 * `/^[A-Za-z0-9]{1,16}$/`, which a 16-digit NIK satisfies. Without clearing on a genuine switch, a
 * NIK typed under WNI would silently pass `identityNumberPattern` validation as a "passport
 * number" under WNA — a wrong identity value shipped as valid. WNA is `disabled: true` in
 * `NATIONALITY_OPTIONS` today, so this branch is unreachable through the UI, but the resolver
 * still implements and tests it so enabling WNA later does not reopen this trap.
 *
 * Branch 1 (same value re-selected) is defensive-only: a browser does not fire `change` on an
 * already-checked radio input, so this case cannot currently be reached through the UI either.
 */
export function resolveNationalityChange(
  current: Pick<PersonalAccountData, "nationality" | "identityNumber">,
  next: Nationality,
): { patch: Partial<PersonalAccountData>; didClearIdentityNumber: boolean } {
  // Branch 1 — defensive: radios don't re-fire `change` on their already-checked value.
  if (current.nationality === next) {
    return { patch: { nationality: next }, didClearIdentityNumber: false };
  }

  // Branch 2 — first selection (F9 fix): nothing was invalidated, so nothing is cleared.
  if (current.nationality === undefined) {
    return { patch: { nationality: next }, didClearIdentityNumber: false };
  }

  // Branches 3/4 — a genuine switch between two chosen nationalities.
  const hadIdentityNumber = !!current.identityNumber;
  return {
    patch: { nationality: next, identityNumber: "" },
    didClearIdentityNumber: hadIdentityNumber,
  };
}

/** Copy shown when a genuine nationality switch has just cleared a previously entered value. */
export function identityNumberClearedCopy(nationality: string | undefined): string {
  return `Status kewarganegaraan berubah, masukkan ulang ${identityNumberLabel(nationality)}`;
}

export type IdentityNumberErrorCopyParams = {
  /** Set the instant a genuine switch clears the field; not gated by `showError`. */
  clearedNotice?: string;
  /** The completeness resolver's own copy for this field, if any — never re-derived here. */
  issueCopy?: string;
  /** Whether submit/blur-time validation copy may render yet. */
  showError: boolean;
};

/**
 * Single source of truth for the identity-number field's inline message. Precedence: the
 * cleared notice ALWAYS wins, ungated by `showError` — it is feedback about an edit the user just
 * made, not a submit-time validation error. Otherwise falls back to the caller-supplied issue
 * copy, gated by `showError`. Takes `issueCopy` as a parameter rather than re-testing the pattern
 * itself, so `resolvePersonalAccountCompleteness` stays the single owner of validation copy.
 */
export function identityNumberErrorCopy(params: IdentityNumberErrorCopyParams): string | undefined {
  const { clearedNotice, issueCopy, showError } = params;

  if (clearedNotice) return clearedNotice;
  if (!showError) return undefined;
  return issueCopy;
}
