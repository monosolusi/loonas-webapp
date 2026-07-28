import { describe, expect, it } from "vitest";
import { ErrorCodes } from "@/core/resources/server-error";
import { shouldRotateIdempotencyKey } from "@/features/invoice/presentations/helpers/idempotency-rotation";

describe("shouldRotateIdempotencyKey", () => {
  it("rotates after a 422 rejection", () => {
    expect(shouldRotateIdempotencyKey(422, ErrorCodes.UNIT_PRICE_MISMATCH.code)).toBe(true);
  });

  it("rotates after a 400 and a 409 conflict", () => {
    expect(shouldRotateIdempotencyKey(400, ErrorCodes.IDEMPOTENCY_KEY_REQUIRED.code)).toBe(true);
    expect(shouldRotateIdempotencyKey(409, ErrorCodes.IDEMPOTENCY_KEY_CONFLICT.code)).toBe(true);
  });

  it("keeps the key while the server is still processing it", () => {
    // Re-sending the identical body under the same key is a probe for that result, not a
    // new attempt — rotating would submit the same cart a second time.
    expect(shouldRotateIdempotencyKey(409, ErrorCodes.IDEMPOTENCY_KEY_IN_PROGRESS.code)).toBe(false);
  });

  it("keeps the key on a 5xx", () => {
    // The request may still have been processed; a fresh key would double-charge.
    expect(shouldRotateIdempotencyKey(500, ErrorCodes.UNKNOWN.code)).toBe(false);
    expect(shouldRotateIdempotencyKey(503, ErrorCodes.UNKNOWN.code)).toBe(false);
  });

  it("keeps the key when there was no response at all", () => {
    expect(shouldRotateIdempotencyKey(null, ErrorCodes.UNKNOWN.code)).toBe(false);
  });
});

/**
 * AC-21 — two submissions across a 4xx must not reuse a key.
 *
 * Mirrors how the provider drives the rule: a key is held in a ref, read per attempt, and
 * replaced in the failure path before the next submission reads it.
 */
describe("submission sequence across a failure", () => {
  function runSequence(status: number, code: string) {
    let key = "key-1";
    let minted = 1;
    const sent: string[] = [];

    // First submission.
    sent.push(key);
    // ...fails.
    if (shouldRotateIdempotencyKey(status, code)) {
      minted += 1;
      key = `key-${minted}`;
    }
    // Cashier retries.
    sent.push(key);

    return sent;
  }

  it("sends a freshly generated key on the retry after a 422", () => {
    const sent = runSequence(422, ErrorCodes.UNIT_PRICE_MISMATCH.code);

    expect(sent).toHaveLength(2);
    expect(sent[0]).not.toBe(sent[1]);
    expect(new Set(sent).size).toBe(2);
  });

  it("replays under the same key when the server never answered", () => {
    const sent = runSequence(500, ErrorCodes.UNKNOWN.code);

    expect(sent[0]).toBe(sent[1]);
  });
});
