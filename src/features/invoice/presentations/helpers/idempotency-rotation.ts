import { ErrorCodes } from "@/core/resources/server-error";

/**
 * Whether a failed submission's Idempotency-Key must be replaced before retrying.
 *
 * Rotate ONLY when the server responded with a 4xx. That means the request was received
 * and rejected, so the key is now bound to a cached failure and reusing it would return
 * that cached 4xx (or a 409 conflict) instead of the corrected sale.
 *
 * Do NOT rotate on a 5xx, a network failure, or any locally-minted error: there the
 * request may still have been processed, and a fresh key would turn the retry into a
 * second recorded sale. A duplicate charge is far worse than a duplicate-key error.
 *
 * `IDEMPOTENCY_KEY_IN_PROGRESS` is a 409 — a 4xx — but is the one code that legitimately
 * reuses the key: the server is still processing THIS key, so re-sending the identical
 * body under it is a probe for that result, not a new attempt.
 */
export function shouldRotateIdempotencyKey(status: number | null, code: string): boolean {
  if (code === ErrorCodes.IDEMPOTENCY_KEY_IN_PROGRESS.code) return false;
  if (status === null) return false;
  return status >= 400 && status < 500;
}
