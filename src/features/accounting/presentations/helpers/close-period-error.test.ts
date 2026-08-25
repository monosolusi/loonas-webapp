import { describe, expect, it } from "vitest";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { isPeriodHasFailedPostingsError, resolveClosePeriodBlock } from "@/features/accounting/presentations/helpers/close-period-error";

function failedPostingsError(details: Record<string, unknown>): ServerError {
  return new ServerError(ErrorCodes.PERIOD_HAS_FAILED_POSTINGS, details);
}

function notDrainedError(details: Record<string, unknown>): ServerError {
  return new ServerError(ErrorCodes.PERIOD_NOT_DRAINED, details);
}

describe("resolveClosePeriodBlock — PERIOD_HAS_FAILED_POSTINGS (flat body)", () => {
  it("reads failed_count from the FLAT body, not a double-nested details envelope", () => {
    const err = failedPostingsError({ failed_count: 7, blocking_postings: [] });
    const block = resolveClosePeriodBlock(err);
    expect(block.kind).toBe("failed-postings");
    if (block.kind !== "failed-postings") throw new Error("expected failed-postings");
    expect(block.totalCount).toBe(7);
    expect(block.message).toContain("7 transaksi");
  });

  it("falls back to the static message when failed_count is missing", () => {
    const block = resolveClosePeriodBlock(failedPostingsError({}));
    if (block.kind !== "failed-postings") throw new Error("expected failed-postings");
    expect(block.totalCount).toBeNull();
    expect(block.message).toBe(ErrorCodes.PERIOD_HAS_FAILED_POSTINGS.message);
  });

  it("models an absent blocking_postings key as null — not an empty array", () => {
    const block = resolveClosePeriodBlock(failedPostingsError({ failed_count: 3 }));
    if (block.kind !== "failed-postings") throw new Error("expected failed-postings");
    expect(block.postings).toBeNull();
    expect(block.overheadAccounts).toEqual([]);
    expect(block.hasUnattributed).toBe(false);
  });

  it("distinguishes a present-but-empty blocking_postings array from an absent key", () => {
    const block = resolveClosePeriodBlock(failedPostingsError({ failed_count: 3, blocking_postings: [] }));
    if (block.kind !== "failed-postings") throw new Error("expected failed-postings");
    expect(block.postings).toEqual([]);
  });

  it("names attributed overhead accounts and dedups them", () => {
    const account = { id: "acc-1", code: "5100", name: "Beban Sewa" };
    const err = failedPostingsError({
      failed_count: 2,
      blocking_postings: [
        { source_table: "pos_sales", outbox_id: "ob-1", error_code: "OVERHEAD_ACCOUNT_AUTO_POSTING_REFUSED", coa_account: account },
        { source_table: "pos_sales", outbox_id: "ob-2", error_code: "OVERHEAD_ACCOUNT_AUTO_POSTING_REFUSED", coa_account: account },
      ],
    });
    const block = resolveClosePeriodBlock(err);
    if (block.kind !== "failed-postings") throw new Error("expected failed-postings");
    expect(block.overheadAccounts).toEqual([account]);
    expect(block.hasUnattributed).toBe(false);
  });

  it("renders an account-less attribution without a blank account, and does not flag it unattributed", () => {
    const err = failedPostingsError({
      failed_count: 1,
      blocking_postings: [
        { source_table: "pos_sales", outbox_id: "ob-1", error_code: "OVERHEAD_ACCOUNT_AUTO_POSTING_REFUSED", coa_account: null },
      ],
    });
    const block = resolveClosePeriodBlock(err);
    if (block.kind !== "failed-postings") throw new Error("expected failed-postings");
    expect(block.overheadAccounts).toEqual([]);
    expect(block.postings?.[0].coaAccount).toBeNull();
  });

  it("flags hasUnattributed and offers no accounts for a null or unrecognised error_code", () => {
    const err = failedPostingsError({
      failed_count: 2,
      blocking_postings: [
        { source_table: "pos_sales", outbox_id: "ob-1", error_code: null, coa_account: null },
        { source_table: "pos_sales", outbox_id: "ob-2", error_code: "SOME_OTHER_CODE", coa_account: null },
      ],
    });
    const block = resolveClosePeriodBlock(err);
    if (block.kind !== "failed-postings") throw new Error("expected failed-postings");
    expect(block.overheadAccounts).toEqual([]);
    expect(block.hasUnattributed).toBe(true);
  });

  it("never derives totalCount from postings.length — the array is capped, the count is the true total", () => {
    const postings = Array.from({ length: 5 }, (_, i) => ({
      source_table: "pos_sales",
      outbox_id: `ob-${i}`,
      error_code: null,
      coa_account: null,
    }));
    const block = resolveClosePeriodBlock(failedPostingsError({ failed_count: 137, blocking_postings: postings }));
    if (block.kind !== "failed-postings") throw new Error("expected failed-postings");
    expect(block.totalCount).toBe(137);
    expect(block.postings).toHaveLength(5);
  });

  it("falls back to null postings when blocking_postings is malformed, without crashing", () => {
    const block = resolveClosePeriodBlock(failedPostingsError({ failed_count: 2, blocking_postings: "not-an-array" }));
    if (block.kind !== "failed-postings") throw new Error("expected failed-postings");
    expect(block.postings).toBeNull();
  });
});

describe("resolveClosePeriodBlock — PERIOD_NOT_DRAINED (explicit branch)", () => {
  it("reads unacked_count and blocking_postings the same way as PERIOD_HAS_FAILED_POSTINGS", () => {
    const block = resolveClosePeriodBlock(notDrainedError({ unacked_count: 4, blocking_postings: [] }));
    expect(block.kind).toBe("not-drained");
    if (block.kind !== "not-drained") throw new Error("expected not-drained");
    expect(block.totalCount).toBe(4);
    expect(block.postings).toEqual([]);
  });

  it("falls back to the static message when unacked_count is missing", () => {
    const block = resolveClosePeriodBlock(notDrainedError({}));
    if (block.kind !== "not-drained") throw new Error("expected not-drained");
    expect(block.message).toBe(ErrorCodes.PERIOD_NOT_DRAINED.message);
  });
});

describe("resolveClosePeriodBlock — other close-period 422s", () => {
  it("resolves PPH_FINAL_NOT_POSTED to its own kind with the static message", () => {
    const err = new ServerError(ErrorCodes.PPH_FINAL_NOT_POSTED);
    expect(resolveClosePeriodBlock(err)).toEqual({ kind: "pph-final", message: ErrorCodes.PPH_FINAL_NOT_POSTED.message });
  });

  it("resolves an unrecognised code to a genuinely generic message — never mislabelled as PERIOD_NOT_DRAINED", () => {
    const err = new ServerError(ErrorCodes.VALIDATION_FAILED, { message: "something else entirely" });
    const block = resolveClosePeriodBlock(err);
    expect(block.kind).toBe("generic");
    expect(block.message).toBe("something else entirely");
  });

  it("falls back to a generic network message for a non-ServerError value", () => {
    expect(resolveClosePeriodBlock(new Error("network down"))).toEqual({
      kind: "generic",
      message: "Terjadi gangguan jaringan. Silakan coba lagi.",
    });
  });
});

describe("isPeriodHasFailedPostingsError", () => {
  it("is true only for a 422 PERIOD_HAS_FAILED_POSTINGS", () => {
    expect(isPeriodHasFailedPostingsError(failedPostingsError({}))).toBe(true);
    expect(isPeriodHasFailedPostingsError(notDrainedError({}))).toBe(false);
    expect(isPeriodHasFailedPostingsError(new Error("x"))).toBe(false);
  });
});
