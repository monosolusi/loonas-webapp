import { SELECT_FIELD_COPY } from "@/app/(user)/onboarding/_utils/select-field-copy";

/**
 * Whether this field's option list depends on another field having been chosen first.
 *
 * A union rather than `parentChosen: boolean` + `parentHintCopy?: string`, so "inert because the
 * parent is unchosen, with no copy saying so" is unrepresentable.
 */
export type SelectFieldParentDependency =
  | { hasParent: false }
  | { hasParent: true; parentChosen: boolean; parentHintCopy: string };

/**
 * The option list's three genuinely distinct conditions. A tri-state rather than
 * `hasOptions: boolean` + `resolved: boolean`, because "populated but never resolved" is not a real
 * state and should not be expressible — same reasoning as the parent union above.
 *
 * - `unresolved` — SWR has no answer yet for this key (`data === undefined`).
 * - `empty` — the request succeeded and returned zero options.
 * - `populated` — there is a usable list on screen.
 */
export type SelectFieldList = "unresolved" | "empty" | "populated";

/** Derives the list state from a SWR hook's `data`. Keeps the ternary in one place, not five. */
export function resolveSelectFieldList(data: readonly unknown[] | undefined): SelectFieldList {
  if (data === undefined) return "unresolved";
  return data.length > 0 ? "populated" : "empty";
}

export type ResolveSelectFieldStateParams = {
  list: SelectFieldList;
  /** SWR's `isValidating` — true for ANY in-flight request, including background revalidation. */
  validating: boolean;
  /** SWR's `error` is set. Note it survives alongside `data` after a failed revalidation. */
  hasFetchError: boolean;
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
  /**
   * The message to announce in a live region — set only when the copy is the RESOLVER's own. Caller
   * validation copy is deliberately excluded: `IncompleteFormNotice` already reads it out through its
   * own `aria-live` region and it is `aria-describedby`-associated on focus, so announcing it here
   * would duplicate it.
   */
  announcement?: string;
  retry: "hidden" | "available" | "pending";
};

/**
 * Single owner of "why is this select inert or empty right now, and what does it say".
 *
 * The original bug: all five onboarding address/occupation selects called a SWR hook and none read
 * `error`. On a failed fetch `loading` flips false and the option list stays `[]`, so the field
 * rendered enabled, empty and SILENT — the KYC address step could not be completed and nothing said
 * why. Note the fix is the missing MESSAGE, not a disable.
 *
 * Everything keys off whether there is a **usable list right now**, which is what makes the second
 * rung correct and is the whole point of the redesign:
 *
 * 1. **Parent unchosen** → the parent hint. Nothing can load, so it is the only honest message, and
 *    "Kabupaten/Kota wajib dipilih" is misleading before a province exists to pick one from. Nothing
 *    is lost by suppressing the child's required-error, because the parent field shows its own in
 *    exactly that state. Ranking this above the fetch error is defensive rather than load-bearing:
 *    the child fetchers early-return `[]` on a missing parent id instead of throwing, so
 *    `hasFetchError && !parentChosen` is unreachable through the UI today.
 * 2. **`populated`** → hand back the caller's own copy and hide the retry, *regardless of `error` or
 *    `validating`*. SWR **keeps `data` when a revalidation fails** (its catch never writes `data`),
 *    and `isLoading` stays false because `data !== undefined` — so keying the error rung off "did a
 *    request fail" painted a red "Gagal memuat..." plus a retry link over a dropdown that works
 *    perfectly, and suppressed the caller's standing error while doing it. A background-refresh
 *    failure over a usable list is not something to shout about, and a background revalidation must
 *    never disable a working field. (This is also why the loading rung tests `isValidating` only
 *    *after* this one: `isValidating` is true for ANY in-flight request, so testing it first would
 *    disable a populated 38-province select on every window refocus.)
 * 3. **In flight, nothing usable yet** → `Memuat pilihan...`. The retry becomes `pending` rather than
 *    disappearing when a failure preceded it, which is how a retry-in-flight is distinguished from a
 *    first load: SWR keeps `error` set until the retry succeeds.
 * 4. **Failed, nothing usable** → red fetch-error copy, and the field stays **ENABLED**. It is empty,
 *    not disabled: disabling drops it out of tab order, so a keyboard user is skipped past the field
 *    and never hears why, and the retry sits immediately after it.
 * 5. **Resolved empty** → `Tidak ada pilihan tersedia.` A legitimately empty server response would
 *    otherwise reproduce the enabled-empty-silent defect exactly. Left enabled for the same
 *    tab-order reason as rung 4, so the explanation is reachable on focus and not only via the live
 *    region.
 * 6. **Unresolved, settled, no error** → treated as loading. SWR has simply not answered yet (a
 *    first render before the request starts, `revalidateOnMount: false`, a paused hook). Falling
 *    through to rung 5 here would flash "Tidak ada pilihan tersedia." before the real list arrives,
 *    so the tri-state makes that flash structurally impossible rather than dependent on whether
 *    `isValidating` happens to be true on the first render.
 *
 * At most ONE of `error`/`description` is ever returned: `SelectInput` renders `description` only
 * when `error` is falsy, so returning both would silently drop one. A caller-supplied `disabled` is
 * deliberately NOT an input — every reason this function produces, it also explains; a caller that
 * disables the field owns explaining that, and composes its flag in at the wrapper. Keeping it out is
 * what lets the regression test sweep the whole input space with no exemption.
 */
export function resolveSelectFieldState(params: ResolveSelectFieldStateParams): SelectFieldState {
  if (params.parent.hasParent && !params.parent.parentChosen) {
    return {
      disabled: true,
      description: params.parent.parentHintCopy,
      announcement: params.parent.parentHintCopy,
      retry: "hidden",
    };
  }

  // Rung 2 — the usable-list rung. Must stay above both `validating` and `hasFetchError`.
  if (params.list === "populated") {
    return {
      disabled: false,
      error: params.callerError,
      description: params.callerError ? undefined : params.callerDescription,
      retry: "hidden",
    };
  }

  if (params.validating) {
    return {
      disabled: true,
      description: SELECT_FIELD_COPY.loading,
      announcement: SELECT_FIELD_COPY.loading,
      // `hasFetchError` here means a previous attempt failed and this is the retry — keep the button
      // mounted so it does not vanish from under a keyboard user's focus.
      retry: params.hasFetchError ? "pending" : "hidden",
    };
  }

  if (params.hasFetchError) {
    // Enabled on purpose — see rung 4 above. Do not "helpfully" disable this.
    return {
      disabled: false,
      error: params.fetchErrorCopy,
      announcement: params.fetchErrorCopy,
      retry: "available",
    };
  }

  if (params.list === "empty") {
    return {
      disabled: false,
      description: SELECT_FIELD_COPY.noOptions,
      announcement: SELECT_FIELD_COPY.noOptions,
      retry: "hidden",
    };
  }

  // Rung 6 — `unresolved`, settled, no error. Read as "no answer yet", never as "empty".
  return {
    disabled: true,
    description: SELECT_FIELD_COPY.loading,
    announcement: SELECT_FIELD_COPY.loading,
    retry: "hidden",
  };
}
