import { SubmitStatus } from "@/app/(user)/onboarding/_utils/submit-status";

export type CreateAccountButtonState = {
  disabled: boolean;
  loading: boolean;
  label: string;
  loadingLabel?: string;
};

type ResolveCreateAccountButtonStateInput = {
  status: SubmitStatus;
  /** "Buat Akun" for the personal flow, "Buat Akun Bisnis" for the business one. */
  label: string;
  /** Matching in-flight copy, e.g. "Membuat akun...". */
  submittingLabel: string;
};

export const SUCCEEDED_LABEL = "Berhasil, mengalihkan...";

/**
 * Pure resolver for the account-creation submit button — the component renders exactly what this
 * returns and computes nothing itself.
 *
 * The invariant, regression-tested over every input: **no input yields `disabled && !loading`**.
 * A disabled button that is not visibly working is a dead end with nothing to explain it, which
 * is precisely QA finding F8 — the button was `disabled={!isClean}` over a 13-condition
 * expression spanning all three wizard steps, so a form the user believed complete rendered grey
 * with no message and no way to discover the offending field. Form completeness therefore does
 * NOT appear in this function at all: an incomplete form still submits, and the handler answers
 * with a named list of what is missing. The only disabled states left are the ones where work is
 * genuinely in flight, and those always show a spinner.
 *
 * Every `loading: true` branch must carry a `loadingLabel`, because `Button` renders `label` only
 * when NOT loading — `loading` without `loadingLabel` is a bare spinner with zero text.
 *
 * `"succeeded"` is TERMINAL and never falls back to idle. It covers the window between the
 * account being created and the route actually changing (`setActive()` then `router.push()`),
 * which SWR's `isMutating` has already stopped covering — without it, the button would flip back
 * to clickable mid-redirect and invite a second submit.
 */
export function resolveCreateAccountButtonState(
  input: ResolveCreateAccountButtonStateInput,
): CreateAccountButtonState {
  const { status, label, submittingLabel } = input;

  if (status === "succeeded") {
    return { disabled: true, loading: true, label, loadingLabel: SUCCEEDED_LABEL };
  }

  if (status === "submitting") {
    return { disabled: true, loading: true, label, loadingLabel: submittingLabel };
  }

  // "idle" and "failed": both must leave the button live. "failed" especially — the user's only
  // way forward is to retry, and the error banner above the button already says why.
  return { disabled: false, loading: false, label };
}
