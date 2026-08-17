import { describe, expect, it } from "vitest";
import { SubmitStatus } from "@/app/(user)/onboarding/_utils/submit-status";
import {
  SUCCEEDED_LABEL,
  resolveCreateAccountButtonState,
} from "@/app/(user)/onboarding/account/_utils/create-account-button-state";

const LABEL = "Buat Akun";
const SUBMITTING_LABEL = "Membuat akun...";
const STATUSES: SubmitStatus[] = ["idle", "submitting", "succeeded", "failed"];

describe("resolveCreateAccountButtonState — the F8 invariant", () => {
  it("never returns a disabled button that is not visibly working, for any status", () => {
    // This is the whole point of the module. QA finding F8 was a submit button rendered
    // `disabled={!isClean}` over a 13-condition expression spanning all three wizard steps: on a
    // form the user believed complete it went grey with no spinner and no message, and there was
    // no way to discover which condition had failed. If this ever fails, that dead end is back.
    for (const status of STATUSES) {
      const state = resolveCreateAccountButtonState({ status, label: LABEL, submittingLabel: SUBMITTING_LABEL });
      expect(state.disabled && !state.loading).toBe(false);
    }
  });

  it("carries a loadingLabel on every loading state, because Button renders label only when not loading", () => {
    for (const status of STATUSES) {
      const state = resolveCreateAccountButtonState({ status, label: LABEL, submittingLabel: SUBMITTING_LABEL });
      if (state.loading) expect(state.loadingLabel).toBeTruthy();
    }
  });

  it("takes no form-completeness input at all, so an incomplete form can still be submitted and answered", () => {
    // Completeness is reported by the submit handler as a named list of missing fields; it must
    // never reach back into the button and disable it.
    const idle = resolveCreateAccountButtonState({ status: "idle", label: LABEL, submittingLabel: SUBMITTING_LABEL });
    expect(idle).toEqual({ disabled: false, loading: false, label: LABEL });
  });
});

describe("resolveCreateAccountButtonState — per status", () => {
  it("leaves the button live while idle", () => {
    expect(resolveCreateAccountButtonState({ status: "idle", label: LABEL, submittingLabel: SUBMITTING_LABEL })).toEqual(
      { disabled: false, loading: false, label: LABEL },
    );
  });

  it("shows the caller's in-flight copy while submitting", () => {
    expect(
      resolveCreateAccountButtonState({ status: "submitting", label: LABEL, submittingLabel: SUBMITTING_LABEL }),
    ).toEqual({ disabled: true, loading: true, label: LABEL, loadingLabel: SUBMITTING_LABEL });
  });

  it("stays loading on success, because the redirect is still in flight after the mutation settles", () => {
    // `isMutating` goes false the moment POST /accounts/personal returns, while setActive() and
    // router.push() are still running. Falling back to idle there would re-arm the button
    // mid-redirect and invite a second submit.
    expect(
      resolveCreateAccountButtonState({ status: "succeeded", label: LABEL, submittingLabel: SUBMITTING_LABEL }),
    ).toEqual({ disabled: true, loading: true, label: LABEL, loadingLabel: SUCCEEDED_LABEL });
  });

  it("re-arms the button after a failure, because retrying is the user's only way forward", () => {
    expect(
      resolveCreateAccountButtonState({ status: "failed", label: LABEL, submittingLabel: SUBMITTING_LABEL }),
    ).toEqual({ disabled: false, loading: false, label: LABEL });
  });

  it("uses the label it is given, so the business flow reads 'Buat Akun Bisnis'", () => {
    const state = resolveCreateAccountButtonState({
      status: "idle",
      label: "Buat Akun Bisnis",
      submittingLabel: "Membuat akun bisnis...",
    });
    expect(state.label).toBe("Buat Akun Bisnis");
  });
});
