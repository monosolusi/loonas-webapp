import { Nationality } from "@/app/(user)/onboarding/account/_utils/personal-account-completeness";

/**
 * Whether a citizenship option can be chosen, and — when it cannot — the reason shown on the card.
 *
 * The union is the point. QA finding F10 was a WNA card that was `disabled: true` and nothing more:
 * clicking it did nothing, no message appeared, and its only cue was `opacity-50` beside an
 * identically-styled WNI card. Modelling unselectability as `{ selectable: false; reason }` makes
 * "inert with nothing on screen explaining why" UNREPRESENTABLE rather than merely tested — the
 * same defect family CLAUDE.md documents as "a control that renders nothing is strictly worse than
 * one that renders grey".
 */
export type NationalityAvailability = { selectable: true } | { selectable: false; reason: string };

export type NationalityOption = {
  value: Nationality;
  title: string;
  description: string;
  uncheckedIconPath: string;
  checkedIconPath: string;
  availability: NationalityAvailability;
};

/**
 * Chip label for an unselectable option. "Belum tersedia" over "Segera hadir": the former is a
 * verifiable statement about what the product supports today, the latter is a delivery promise the
 * product cannot underwrite. Matches the in-repo vocabulary for an unsupported capability
 * ("Belum didukung" in `checkout-step-method-body-list.tsx`).
 */
export const UNAVAILABLE_NATIONALITY_CHIP_LABEL = "Belum tersedia";

/**
 * The citizenship catalogue. Single owner — `nationality-radio-group.tsx` reads it, nothing else
 * restates it.
 *
 * Deliberately NO support link on the unselectable option. This is a decision, not an omission:
 * `LOONAS_WHATSAPP_URL` (`core/utilities/contact.ts`) is still `""`, and support cannot unblock WNA
 * registration because the capability does not exist — pointing there manufactures a dead end plus
 * support load. The business flow is not an alternative either: `@businessAccount/@documentUpload`
 * requires a "KTP Direksi". Do not "helpfully" add one.
 */
export const NATIONALITY_OPTIONS: readonly NationalityOption[] = [
  {
    value: "WNI",
    title: "WNI",
    description: "Warga Negara Indonesia",
    uncheckedIconPath: "/assets/images/flag-icon-neutral-200-w20-h20.svg",
    checkedIconPath: "/assets/images/flag-icon-primary-w20-h20.svg",
    availability: { selectable: true },
  },
  {
    value: "WNA",
    title: "WNA",
    description: "Warga Negara Asing",
    uncheckedIconPath: "/assets/images/globe-icon-neutral-200-w20-h20.svg",
    checkedIconPath: "/assets/images/globe-icon-primary-w20-h20.svg",
    // States what the product currently supports rather than asserting a legal eligibility
    // criterion — this is a KYC surface, and "hanya untuk pemegang KTP Indonesia" would be the
    // latter.
    availability: { selectable: false, reason: "Saat ini pendaftaran hanya tersedia untuk WNI." },
  },
];

/**
 * The single owner of "may this nationality be committed to the form buffer?".
 *
 * This is the WRITE-path gate, distinct from the card's rendering decision (which consumes the
 * option's `availability` union directly). The native `disabled` attribute on the radio input is
 * the primary block and the F9 `resolveNationalityChange` invariant depends on the click never
 * firing — this guard is what keeps an unsupported nationality out of a KYC payload if a future
 * refactor ever swaps that attribute for a focusable `aria-disabled`.
 */
export function isNationalitySelectable(value: Nationality): boolean {
  return NATIONALITY_OPTIONS.find((option) => option.value === value)?.availability.selectable ?? false;
}
