import { describe, expect, it } from "vitest";
import { SELECT_FIELD_COPY } from "@/app/(user)/onboarding/_utils/select-field-copy";
import {
  ResolveSelectFieldStateParams,
  SelectFieldList,
  SelectFieldParentDependency,
  resolveSelectFieldList,
  resolveSelectFieldState,
} from "@/app/(user)/onboarding/_utils/resolve-select-field-state";

const FETCH_ERROR_COPY = SELECT_FIELD_COPY.fetchError.city;
const PARENT_HINT_COPY = SELECT_FIELD_COPY.parentHint.city;
const CALLER_ERROR = "Kabupaten/Kota wajib dipilih";
const CALLER_DESCRIPTION = "Sesuai KTP Anda";

const PARENTS: SelectFieldParentDependency[] = [
  { hasParent: false },
  { hasParent: true, parentChosen: true, parentHintCopy: PARENT_HINT_COPY },
  { hasParent: true, parentChosen: false, parentHintCopy: PARENT_HINT_COPY },
];
const LISTS: SelectFieldList[] = ["unresolved", "empty", "populated"];

/** Every combination: 3 parents x 3 list states x validating x hasFetchError x caller-copy. */
function everyCombination(): ResolveSelectFieldStateParams[] {
  const combinations: ResolveSelectFieldStateParams[] = [];
  for (const parent of PARENTS) {
    for (const list of LISTS) {
      for (const validating of [false, true]) {
        for (const hasFetchError of [false, true]) {
          for (const callerCopy of [true, false]) {
            combinations.push({
              list,
              validating,
              hasFetchError,
              fetchErrorCopy: FETCH_ERROR_COPY,
              parent,
              callerError: callerCopy ? CALLER_ERROR : undefined,
              callerDescription: callerCopy ? CALLER_DESCRIPTION : undefined,
            });
          }
        }
      }
    }
  }
  return combinations;
}

const label = (params: ResolveSelectFieldStateParams) => JSON.stringify(params);

describe("resolveSelectFieldState — the load-bearing invariants", () => {
  it("never returns a disabled field without copy explaining why, for ANY input", () => {
    // The whole point of the module, and the direct analogue of
    // `create-account-button-state.test.ts`'s "no input yields disabled && !loading".
    //
    // Deliberately ONE-DIRECTIONAL: disabled implies an explanation, NOT the converse. A field can
    // carry copy while staying enabled — that is exactly the fetch-error and empty-list states. Do
    // not strengthen this to an iff; it would forbid the correct behaviour.
    for (const params of everyCombination()) {
      const state = resolveSelectFieldState(params);
      if (!state.disabled) continue;
      const copy = state.error ?? state.description;
      expect(copy, label(params)).toBeTruthy();
      expect(copy?.trim().length, label(params)).toBeGreaterThan(0);
    }
  });

  it("never returns both an error and a description, because SelectInput would drop one", () => {
    for (const params of everyCombination()) {
      const state = resolveSelectFieldState(params);
      expect(!!state.error && !!state.description, label(params)).toBe(false);
    }
  });

  it("never leaves a usable list disabled, and never shouts a fetch failure over one", () => {
    // The S1 regression. SWR keeps `data` when a revalidation fails and `isLoading` stays false, so
    // keying the error rung off "did a request fail" painted a red failure and a retry link over a
    // working dropdown — a false alarm on a KYC path, very reachable on a flaky mobile network.
    for (const params of everyCombination()) {
      if (params.list !== "populated") continue;
      if (params.parent.hasParent && !params.parent.parentChosen) continue;
      const state = resolveSelectFieldState(params);
      expect(state.disabled, label(params)).toBe(false);
      expect(state.error, label(params)).not.toBe(FETCH_ERROR_COPY);
      expect(state.description, label(params)).not.toBe(SELECT_FIELD_COPY.loading);
      expect(state.retry, label(params)).toBe("hidden");
      expect(state.announcement, label(params)).toBeUndefined();
    }
  });

  it("never announces the caller's own validation copy", () => {
    // N3: `IncompleteFormNotice` already reads that out through its own live region, and it is
    // `aria-describedby`-associated on focus. Announcing it here would duplicate it.
    for (const params of everyCombination()) {
      const state = resolveSelectFieldState(params);
      expect(state.announcement, label(params)).not.toBe(CALLER_ERROR);
      expect(state.announcement, label(params)).not.toBe(CALLER_DESCRIPTION);
      // When set, the announcement is exactly the message on screen.
      if (state.announcement) expect(state.announcement, label(params)).toBe(state.error ?? state.description);
    }
  });

  it("shows a retry only when a fetch actually failed", () => {
    for (const params of everyCombination()) {
      const state = resolveSelectFieldState(params);
      if (state.retry === "hidden") continue;
      expect(params.hasFetchError, label(params)).toBe(true);
    }
  });

  it("offers a live retry only under its own error message, and a pending one only in flight", () => {
    for (const params of everyCombination()) {
      const state = resolveSelectFieldState(params);
      if (state.retry === "available") {
        expect(state.error, label(params)).toBe(FETCH_ERROR_COPY);
        expect(state.disabled, label(params)).toBe(false);
      }
      if (state.retry === "pending") {
        expect(params.validating, label(params)).toBe(true);
        expect(state.description, label(params)).toBe(SELECT_FIELD_COPY.loading);
      }
    }
  });

  it("never reports an empty list while SWR has not answered yet", () => {
    // Rung 6. Otherwise a first render flashes "Tidak ada pilihan tersedia." before the real list
    // arrives, which would make the fix depend on whether `isValidating` is true on the first render.
    for (const params of everyCombination()) {
      if (params.list !== "unresolved") continue;
      const state = resolveSelectFieldState(params);
      expect(state.description, label(params)).not.toBe(SELECT_FIELD_COPY.noOptions);
    }
  });
});

describe("resolveSelectFieldState — precedence", () => {
  const base: ResolveSelectFieldStateParams = {
    list: "populated",
    validating: false,
    hasFetchError: false,
    fetchErrorCopy: FETCH_ERROR_COPY,
    parent: { hasParent: true, parentChosen: true, parentHintCopy: PARENT_HINT_COPY },
    callerError: CALLER_ERROR,
    callerDescription: CALLER_DESCRIPTION,
  };
  const unchosen: SelectFieldParentDependency = {
    hasParent: true,
    parentChosen: false,
    parentHintCopy: PARENT_HINT_COPY,
  };

  it("puts the parent hint above everything else", () => {
    const state = resolveSelectFieldState({ ...base, list: "unresolved", hasFetchError: true, parent: unchosen });
    expect(state).toEqual({
      disabled: true,
      description: PARENT_HINT_COPY,
      announcement: PARENT_HINT_COPY,
      retry: "hidden",
    });
  });

  it("keeps a populated list live through a failed background revalidation", () => {
    const state = resolveSelectFieldState({ ...base, hasFetchError: true, validating: true });
    expect(state).toEqual({ disabled: false, error: CALLER_ERROR, description: undefined, retry: "hidden" });
  });

  it("shows loading, not a stale error, while a retry is in flight", () => {
    const state = resolveSelectFieldState({ ...base, list: "unresolved", validating: true, hasFetchError: true });
    expect(state).toEqual({
      disabled: true,
      description: SELECT_FIELD_COPY.loading,
      announcement: SELECT_FIELD_COPY.loading,
      retry: "pending",
    });
  });

  it("hides the retry during a first load, when nothing has failed yet", () => {
    const state = resolveSelectFieldState({ ...base, list: "unresolved", validating: true });
    expect(state.retry).toBe("hidden");
    expect(state.description).toBe(SELECT_FIELD_COPY.loading);
  });

  it("reports a failed first load as an enabled, reachable error with a live retry", () => {
    const state = resolveSelectFieldState({ ...base, list: "unresolved", hasFetchError: true });
    expect(state).toEqual({
      disabled: false,
      error: FETCH_ERROR_COPY,
      announcement: FETCH_ERROR_COPY,
      retry: "available",
    });
  });

  it("explains a legitimately empty list instead of going silent", () => {
    const state = resolveSelectFieldState({ ...base, list: "empty" });
    expect(state).toEqual({
      disabled: false,
      description: SELECT_FIELD_COPY.noOptions,
      announcement: SELECT_FIELD_COPY.noOptions,
      retry: "hidden",
    });
  });

  it("treats an unresolved, settled list as loading rather than empty", () => {
    const state = resolveSelectFieldState({ ...base, list: "unresolved" });
    expect(state).toEqual({
      disabled: true,
      description: SELECT_FIELD_COPY.loading,
      announcement: SELECT_FIELD_COPY.loading,
      retry: "hidden",
    });
  });

  it("falls through to the caller's copy once a usable list is there", () => {
    expect(resolveSelectFieldState(base)).toEqual({
      disabled: false,
      error: CALLER_ERROR,
      description: undefined,
      retry: "hidden",
    });
  });

  it("shows the caller's description when it has no error to show", () => {
    expect(resolveSelectFieldState({ ...base, callerError: undefined })).toEqual({
      disabled: false,
      error: undefined,
      description: CALLER_DESCRIPTION,
      retry: "hidden",
    });
  });

  it("leaves a ready, valid, parentless field fully live and silent", () => {
    const state = resolveSelectFieldState({
      ...base,
      parent: { hasParent: false },
      callerError: undefined,
      callerDescription: undefined,
    });
    expect(state).toEqual({ disabled: false, error: undefined, description: undefined, retry: "hidden" });
  });
});

describe("resolveSelectFieldList", () => {
  it("reads undefined as unresolved, never as empty", () => {
    // The distinction rung 6 depends on. `options` is `[]` in both cases at the call site, which is
    // why this derives from the hook's raw `data` instead.
    expect(resolveSelectFieldList(undefined)).toBe("unresolved");
  });

  it("reads a zero-length response as empty", () => {
    expect(resolveSelectFieldList([])).toBe("empty");
  });

  it("reads a non-empty response as populated", () => {
    expect(resolveSelectFieldList([{ id: "1" }])).toBe("populated");
  });
});
