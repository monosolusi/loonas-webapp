import { SubmitStatus } from "@/app/(user)/onboarding/user/_utils/submit-status";

export type CreateUserButtonState = {
  disabled: boolean;
  loading: boolean;
  label: string;
  loadingLabel?: string;
};

type ResolveCreateUserButtonStateInput = {
  status: SubmitStatus;
  isClean: boolean;
  isReady: boolean;
  isSignedIn: boolean;
};

const LABEL = "Buat User";
// `Button` only renders `label` when NOT loading — a `loading: true` state with no `loadingLabel`
// renders a bare spinner and nothing else, which was a direct cause of "spinner ran with no
// explanation" (QA attempt 1). Every `loading: true` branch below must carry one.
const SUBMITTING_LABEL = "Memproses...";
const SUCCEEDED_LABEL = "Berhasil, mengalihkan...";

/**
 * Pure resolver for `CreateUserButton` — the component renders exactly what this returns and
 * computes nothing itself.
 *
 * The load-bearing invariant (regression-tested): on `status === "succeeded"` the button is
 * ALWAYS `loading: true` with a `loadingLabel`, for every combination of the other flags. That
 * combination is what QA hit — `setActive()` and `createUser()`'s `finally` both resolve on the
 * same tick, so a naive `disabled = !isClean || !isReady || isSignedIn` renders a dead grey
 * button with no spinner and no explanation right when the session actually went live.
 *
 * The label stays `"Memproses..."` for the entire submitting phase, including once the
 * below-button `CreateUserStatusNotice` starts showing its slow/stalled hints — those own "why is
 * this slow", so forking this label on elapsed time would create a second source of truth for
 * the same fact.
 */
export function resolveCreateUserButtonState(input: ResolveCreateUserButtonStateInput): CreateUserButtonState {
  const { status, isClean, isReady, isSignedIn } = input;

  if (status === "succeeded") {
    return { disabled: true, loading: true, label: LABEL, loadingLabel: SUCCEEDED_LABEL };
  }

  if (status === "submitting") {
    return { disabled: true, loading: true, label: LABEL, loadingLabel: SUBMITTING_LABEL };
  }

  // status is "idle" or "failed" here — "failed" must re-enable the button so the user can
  // retry, so from this point on only the form/session flags decide `disabled`.
  if (isSignedIn || !isReady || !isClean) {
    return { disabled: true, loading: false, label: LABEL };
  }

  return { disabled: false, loading: false, label: LABEL };
}
