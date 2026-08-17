/**
 * Shared loading copy for every option list on the onboarding flow. One string, not five: the label
 * directly above the field already says which list is loading, so per-field variants are pure drift
 * surface. Three dots match the flow's house style ("Membuat akun...", "Sedang keluar...").
 *
 * Deliberately not silent. While loading, the parent HAS been chosen, so the parent hint would be a
 * lie — and going quiet removes a block-level span and shifts every field below it mid-interaction.
 */
export const LOADING_OPTIONS_COPY = "Memuat pilihan...";

/**
 * Whether this field's option list depends on another field having been chosen first.
 *
 * A union rather than `parentChosen: boolean` + `parentHintCopy?: string`, so "inert because the
 * parent is unchosen, with no copy saying so" is unrepresentable — the same technique as
 * `NationalityAvailability`.
 */
export type SelectFieldParentDependency =
  | { hasParent: false }
  | { hasParent: true; parentChosen: boolean; parentHintCopy: string };

export type ResolveSelectFieldStateParams = {
  /** The SWR hook's `error` is set. Note `loading` is already false by then and `options` is `[]`. */
  hasFetchError: boolean;
  loading: boolean;
  /** Whether a retry affordance can be offered — i.e. the hook exposes a `refresh`. */
  canRetry: boolean;
  fetchErrorCopy: string;
  parent: SelectFieldParentDependency;
  /** The page's standing validation copy for this field (e.g. "Provinsi wajib dipilih"). */
  callerError?: string;
  callerDescription?: string;
};

export type SelectFieldState = {
  disabled: boolean;
  error?: string;
  description?: string;
  showRetry: boolean;
};

/**
 * Single owner of "why is this select inert right now, and what does it say".
 *
 * The bug this exists to make unrepresentable: all five onboarding address/occupation selects called
 * a SWR hook and none of them read `error`. On a failed fetch `loading` flips false and the option
 * list stays `[]`, so the field rendered ENABLED, EMPTY and SILENT — the user taps "Provinsi", gets
 * an empty dropdown, nothing explains it, and the KYC address step cannot be completed except by
 * reloading. For city/district/subdistrict it was also indistinguishable from "parent not chosen".
 *
 * Precedence: fetch-error > parent-unchosen hint > loading > the caller's standing required-error.
 * Telling someone "Pilih kota/kabupaten" when the list failed to load, or before they have chosen a
 * province, is actively misleading — the message describing why the control is inert RIGHT NOW
 * always outranks the caller's standing copy. This mirrors the house `localError ?? props.error`
 * pattern in `EmailInput` / `FileUploadInput`. Nothing is lost by suppressing a child's
 * required-error while its parent is unchosen, because the parent field is showing its own error in
 * exactly that state.
 *
 * A fetch failure renders as `error` (red — something is genuinely broken); the parent hint and the
 * loading line render as `description` (grey — the user has done nothing wrong, this is guidance).
 * At most ONE of the two is ever returned: `SelectInput` renders `description` only when `error` is
 * falsy, so returning both would silently drop one.
 *
 * A caller-supplied `disabled` is deliberately NOT an input here. Every reason this function
 * produces, it also explains; a caller that disables the field for its own reasons owns explaining
 * that, and composes its flag in at the wrapper. Keeping it out is what lets the regression test
 * sweep the whole input space with no exemption.
 */
export function resolveSelectFieldState(params: ResolveSelectFieldStateParams): SelectFieldState {
  if (params.hasFetchError) {
    return { disabled: true, error: params.fetchErrorCopy, showRetry: params.canRetry };
  }

  if (params.parent.hasParent && !params.parent.parentChosen) {
    return { disabled: true, description: params.parent.parentHintCopy, showRetry: false };
  }

  if (params.loading) {
    return { disabled: true, description: LOADING_OPTIONS_COPY, showRetry: false };
  }

  return {
    disabled: false,
    error: params.callerError,
    description: params.callerError ? undefined : params.callerDescription,
    showRetry: false,
  };
}
