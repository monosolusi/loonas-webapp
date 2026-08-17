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
 * list stays `[]`, so the field rendered enabled, empty and SILENT — the user taps "Provinsi", gets
 * an empty dropdown, nothing explains it, and the KYC address step cannot be completed except by
 * reloading. For city/district/subdistrict it was also indistinguishable from "parent not chosen".
 * Note the fix is the missing MESSAGE, not a disable: an empty select stays enabled (see rung 3).
 *
 * Precedence, top wins: parent-unchosen hint > loading > fetch-error > the caller's standing
 * required-error. Each rung is the only true statement available at that point:
 *
 * 1. If the parent is unchosen, nothing can load, so the parent hint is the only honest message —
 *    and "Kabupaten/Kota wajib dipilih" is actively misleading before a province exists to pick one
 *    from. Nothing is lost by suppressing the child's required-error there, because the parent field
 *    is showing its own error in exactly that state. Ranking this ABOVE the fetch error is
 *    deliberately defensive rather than load-bearing: `ListCityFetcher` and its siblings early-return
 *    `[]` when the parent id is missing instead of throwing, so `hasFetchError && !parentChosen` is
 *    unreachable through the UI today. The resolver is total and its test sweeps the whole input
 *    space, so the rung exists to make the ordering deliberate — if that state ever does arise, "pick
 *    a province first" is the truthful message, not "the list failed".
 * 2. **Loading outranks a fetch error.** SWR keeps the PREVIOUS `error` populated while it
 *    revalidates, so during an in-flight retry a stale red failure would sit next to an enabled
 *    retry button and read as "still broken" — inviting a double-tap. Suppressing `showRetry` while
 *    loading is half of that same fix. No in-flight state is needed to detect this: `isLoading` is
 *    `isValidating && data === undefined`, and `data` is undefined after a failure, so `loading`
 *    already flips true on retry.
 * 3. A fetch failure renders as `error` (red — something is genuinely broken) and, unlike the two
 *    rungs above it, leaves the field **ENABLED**: it is empty, not disabled, and the error must stay
 *    reachable in tab order with the retry immediately after it.
 * 4. Otherwise the caller's standing validation copy, unchanged.
 *
 * The parent hint and the loading line render as `description` (grey — the user has done nothing
 * wrong, this is guidance). At most ONE of `error`/`description` is ever returned: `SelectInput`
 * renders `description` only when `error` is falsy, so returning both would silently drop one.
 *
 * A caller-supplied `disabled` is deliberately NOT an input here. Every reason this function
 * produces, it also explains; a caller that disables the field for its own reasons owns explaining
 * that, and composes its flag in at the wrapper. Keeping it out is what lets the regression test
 * sweep the whole input space with no exemption.
 */
export function resolveSelectFieldState(params: ResolveSelectFieldStateParams): SelectFieldState {
  if (params.parent.hasParent && !params.parent.parentChosen) {
    return { disabled: true, description: params.parent.parentHintCopy, showRetry: false };
  }

  if (params.loading) {
    return { disabled: true, description: LOADING_OPTIONS_COPY, showRetry: false };
  }

  if (params.hasFetchError) {
    // Enabled on purpose — see rung 3 above. Do not "helpfully" disable this.
    return { disabled: false, error: params.fetchErrorCopy, showRetry: params.canRetry };
  }

  return {
    disabled: false,
    error: params.callerError,
    description: params.callerError ? undefined : params.callerDescription,
    showRetry: false,
  };
}
