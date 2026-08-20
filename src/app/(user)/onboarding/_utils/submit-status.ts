/**
 * Lifecycle of an onboarding submit attempt, shared by `/onboarding/user` and
 * `/onboarding/account`. `"succeeded"` means the work is done and the page is handing off to the
 * next step — it is a TERMINAL state: never fall back to `"idle"` from it, or a still-in-flight
 * redirect can render as if nothing happened (the dead-grey-button regression both pages were
 * fixed for).
 */
export type SubmitStatus = "idle" | "submitting" | "succeeded" | "failed";
