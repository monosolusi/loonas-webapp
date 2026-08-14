import { describe, expect, it } from "vitest";
import { resolveCreateUserButtonState } from "@/app/(user)/onboarding/user/_utils/create-user-button-state";
import { SubmitStatus } from "@/app/(user)/onboarding/user/_utils/submit-status";

describe("resolveCreateUserButtonState", () => {
  it("is never { disabled: true, loading: false } once the submission has succeeded — the QA attempt-3 regression", () => {
    const booleans = [true, false];

    for (const isClean of booleans) {
      for (const isReady of booleans) {
        for (const isSignedIn of booleans) {
          const state = resolveCreateUserButtonState({ status: "succeeded", isClean, isReady, isSignedIn });

          expect(state.loading).toBe(true);
          expect(state.loadingLabel).toBeTruthy();
        }
      }
    }
  });

  it("never returns loading: true without a non-empty loadingLabel — a bare spinner explains nothing", () => {
    const statuses: SubmitStatus[] = ["idle", "submitting", "succeeded", "failed"];
    const booleans = [true, false];

    for (const status of statuses) {
      for (const isClean of booleans) {
        for (const isReady of booleans) {
          for (const isSignedIn of booleans) {
            const state = resolveCreateUserButtonState({ status, isClean, isReady, isSignedIn });
            if (state.loading) expect(state.loadingLabel).toBeTruthy();
          }
        }
      }
    }
  });

  it("shows the submitting label while submitting", () => {
    const state = resolveCreateUserButtonState({
      status: "submitting",
      isClean: true,
      isReady: true,
      isSignedIn: false,
    });

    expect(state).toEqual({ disabled: true, loading: true, label: "Buat User", loadingLabel: "Memproses..." });
  });

  it("shows the succeeded/redirecting label once succeeded", () => {
    const state = resolveCreateUserButtonState({
      status: "succeeded",
      isClean: true,
      isReady: true,
      isSignedIn: false,
    });

    expect(state).toEqual({
      disabled: true,
      loading: true,
      label: "Buat User",
      loadingLabel: "Berhasil, mengalihkan...",
    });
  });

  it("disables without a spinner when the form is incomplete", () => {
    const state = resolveCreateUserButtonState({
      status: "idle",
      isClean: false,
      isReady: true,
      isSignedIn: false,
    });

    expect(state).toEqual({ disabled: true, loading: false, label: "Buat User" });
  });

  it("disables without a spinner while Clerk/session data isn't ready yet", () => {
    const state = resolveCreateUserButtonState({
      status: "idle",
      isClean: true,
      isReady: false,
      isSignedIn: false,
    });

    expect(state).toEqual({ disabled: true, loading: false, label: "Buat User" });
  });

  it("disables without a spinner when the user already has an active session", () => {
    const state = resolveCreateUserButtonState({
      status: "idle",
      isClean: true,
      isReady: true,
      isSignedIn: true,
    });

    expect(state).toEqual({ disabled: true, loading: false, label: "Buat User" });
  });

  it("re-enables after a failure so the user can retry, when the form is still clean and ready", () => {
    const state = resolveCreateUserButtonState({
      status: "failed",
      isClean: true,
      isReady: true,
      isSignedIn: false,
    });

    expect(state).toEqual({ disabled: false, loading: false, label: "Buat User" });
  });

  it("keeps a failed submission disabled if the form is no longer clean", () => {
    const state = resolveCreateUserButtonState({
      status: "failed",
      isClean: false,
      isReady: true,
      isSignedIn: false,
    });

    expect(state).toEqual({ disabled: true, loading: false, label: "Buat User" });
  });

  it("enables once idle, clean, ready and not signed in", () => {
    const state = resolveCreateUserButtonState({
      status: "idle",
      isClean: true,
      isReady: true,
      isSignedIn: false,
    });

    expect(state).toEqual({ disabled: false, loading: false, label: "Buat User" });
  });

  it("never returns loading without status submitting or succeeded", () => {
    const statuses: SubmitStatus[] = ["idle", "failed"];
    const booleans = [true, false];

    for (const status of statuses) {
      for (const isClean of booleans) {
        for (const isReady of booleans) {
          for (const isSignedIn of booleans) {
            const state = resolveCreateUserButtonState({ status, isClean, isReady, isSignedIn });
            expect(state.loading).toBe(false);
          }
        }
      }
    }
  });
});
