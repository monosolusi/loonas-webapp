/**
 * Lifecycle of a `/onboarding/user` submit attempt. `"succeeded"` means the session is active
 * and the page is handing off to step 2 — it is a TERMINAL state: never fall back to `"idle"`
 * from it, or a still-in-flight redirect can render as if nothing happened (the dead-grey-button
 * regression this page was built to fix).
 */
export type SubmitStatus = "idle" | "submitting" | "succeeded" | "failed";
