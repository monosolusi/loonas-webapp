import { describe, expect, it } from "vitest";
import {
  LOADING_OPTIONS_COPY,
  ResolveSelectFieldStateParams,
  SelectFieldParentDependency,
  resolveSelectFieldState,
} from "@/app/(user)/onboarding/_utils/resolve-select-field-state";

const FETCH_ERROR_COPY = "Gagal memuat daftar provinsi";
const PARENT_HINT_COPY = "Pilih provinsi terlebih dahulu";
const CALLER_ERROR = "Kabupaten/Kota wajib dipilih";
const CALLER_DESCRIPTION = "Sesuai KTP Anda";

const PARENTS: SelectFieldParentDependency[] = [
  { hasParent: false },
  { hasParent: true, parentChosen: true, parentHintCopy: PARENT_HINT_COPY },
  { hasParent: true, parentChosen: false, parentHintCopy: PARENT_HINT_COPY },
];

/** Every combination of the resolver's inputs — 3 parents x 2 x 2 x 2 x (caller copy on/off). */
function everyCombination(): ResolveSelectFieldStateParams[] {
  const combinations: ResolveSelectFieldStateParams[] = [];
  for (const parent of PARENTS) {
    for (const hasFetchError of [false, true]) {
      for (const loading of [false, true]) {
        for (const canRetry of [false, true]) {
          for (const callerCopy of [true, false]) {
            combinations.push({
              hasFetchError,
              loading,
              canRetry,
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

describe("resolveSelectFieldState — the load-bearing invariant", () => {
  it("never returns a disabled field without copy explaining why, for ANY input", () => {
    // This is the whole point of the module, and the direct analogue of
    // `create-account-button-state.test.ts`'s "no input yields disabled && !loading". All five
    // onboarding selects used to go inert — on a failed fetch, or while a parent was unchosen —
    // with nothing on screen accounting for it. If this ever fails, that dead end is back.
    for (const params of everyCombination()) {
      const state = resolveSelectFieldState(params);
      if (!state.disabled) continue;
      const copy = state.error ?? state.description;
      expect(copy, JSON.stringify(params)).toBeTruthy();
      expect(copy?.trim().length, JSON.stringify(params)).toBeGreaterThan(0);
    }
  });

  it("never returns both an error and a description, because SelectInput would drop one", () => {
    // `SelectInput` renders `description` only when `error` is falsy.
    for (const params of everyCombination()) {
      const state = resolveSelectFieldState(params);
      expect(!!state.error && !!state.description, JSON.stringify(params)).toBe(false);
    }
  });

  it("offers retry only when the list actually failed and a refresh exists", () => {
    for (const params of everyCombination()) {
      const state = resolveSelectFieldState(params);
      expect(state.showRetry, JSON.stringify(params)).toBe(params.hasFetchError && params.canRetry);
    }
  });
});

describe("resolveSelectFieldState — precedence", () => {
  const base: ResolveSelectFieldStateParams = {
    hasFetchError: false,
    loading: false,
    canRetry: true,
    fetchErrorCopy: FETCH_ERROR_COPY,
    parent: { hasParent: true, parentChosen: true, parentHintCopy: PARENT_HINT_COPY },
    callerError: CALLER_ERROR,
    callerDescription: CALLER_DESCRIPTION,
  };

  it("puts a fetch failure above the parent hint", () => {
    const state = resolveSelectFieldState({
      ...base,
      hasFetchError: true,
      parent: { hasParent: true, parentChosen: false, parentHintCopy: PARENT_HINT_COPY },
    });
    expect(state).toEqual({ disabled: true, error: FETCH_ERROR_COPY, showRetry: true });
  });

  it("puts a fetch failure above loading", () => {
    const state = resolveSelectFieldState({ ...base, hasFetchError: true, loading: true });
    expect(state).toEqual({ disabled: true, error: FETCH_ERROR_COPY, showRetry: true });
  });

  it("puts the parent hint above loading", () => {
    // A stale `loading` from the previous parent must never render "Memuat pilihan..." over the
    // truthful "you have not chosen a province yet".
    const state = resolveSelectFieldState({
      ...base,
      loading: true,
      parent: { hasParent: true, parentChosen: false, parentHintCopy: PARENT_HINT_COPY },
    });
    expect(state).toEqual({ disabled: true, description: PARENT_HINT_COPY, showRetry: false });
  });

  it("puts the parent hint above the caller's standing required-error", () => {
    // Nothing is lost: the parent field is showing its own error in exactly this state, and
    // "Kabupaten/Kota wajib dipilih" is misleading before a province exists to pick one from.
    const state = resolveSelectFieldState({
      ...base,
      parent: { hasParent: true, parentChosen: false, parentHintCopy: PARENT_HINT_COPY },
    });
    expect(state).toEqual({ disabled: true, description: PARENT_HINT_COPY, showRetry: false });
  });

  it("puts loading above the caller's standing required-error", () => {
    const state = resolveSelectFieldState({ ...base, loading: true });
    expect(state).toEqual({ disabled: true, description: LOADING_OPTIONS_COPY, showRetry: false });
  });

  it("falls through to the caller's copy once the list is ready", () => {
    expect(resolveSelectFieldState(base)).toEqual({
      disabled: false,
      error: CALLER_ERROR,
      description: undefined,
      showRetry: false,
    });
  });

  it("shows the caller's description when it has no error to show", () => {
    expect(resolveSelectFieldState({ ...base, callerError: undefined })).toEqual({
      disabled: false,
      error: undefined,
      description: CALLER_DESCRIPTION,
      showRetry: false,
    });
  });

  it("leaves a ready, valid, parentless field fully live and silent", () => {
    expect(
      resolveSelectFieldState({
        ...base,
        parent: { hasParent: false },
        callerError: undefined,
        callerDescription: undefined,
      }),
    ).toEqual({ disabled: false, error: undefined, description: undefined, showRetry: false });
  });
});

describe("resolveSelectFieldState — a parentless field", () => {
  it("is never held inert waiting for a parent it does not have", () => {
    // Province and occupation top their own chains; only their own load can make them inert.
    const state = resolveSelectFieldState({
      hasFetchError: false,
      loading: false,
      canRetry: true,
      fetchErrorCopy: FETCH_ERROR_COPY,
      parent: { hasParent: false },
    });
    expect(state.disabled).toBe(false);
  });

  it("still reports its own fetch failure", () => {
    const state = resolveSelectFieldState({
      hasFetchError: true,
      loading: false,
      canRetry: true,
      fetchErrorCopy: FETCH_ERROR_COPY,
      parent: { hasParent: false },
    });
    expect(state).toEqual({ disabled: true, error: FETCH_ERROR_COPY, showRetry: true });
  });

  it("cannot offer retry when the hook exposes no refresh", () => {
    const state = resolveSelectFieldState({
      hasFetchError: true,
      loading: false,
      canRetry: false,
      fetchErrorCopy: FETCH_ERROR_COPY,
      parent: { hasParent: false },
    });
    expect(state).toEqual({ disabled: true, error: FETCH_ERROR_COPY, showRetry: false });
  });
});
