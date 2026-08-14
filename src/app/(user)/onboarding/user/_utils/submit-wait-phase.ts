export type SubmitWaitPhase = "none" | "slow" | "stalled";

/** Below this, a submit is presumed to be proceeding normally — no notice shown. */
export const SLOW_THRESHOLD_MS = 8_000;

/** Past this, the submit is presumed genuinely stuck — show the "may have already succeeded,
 * reload to check" advisory instead of the plain "still working" caption. */
export const STALLED_THRESHOLD_MS = 20_000;

/**
 * Pure resolver for how long a submit has been in flight → what notice (if any) to show below
 * the button. The `.tsx` owns the interval that produces `elapsedMs`; this function only maps
 * that number to a phase.
 */
export function resolveWaitPhase(elapsedMs: number): SubmitWaitPhase {
  if (elapsedMs >= STALLED_THRESHOLD_MS) return "stalled";
  if (elapsedMs >= SLOW_THRESHOLD_MS) return "slow";
  return "none";
}
