import { describe, expect, it } from "vitest";
import { RetryFailedPostingsResultModel } from "@/features/accounting/data/models/retry-failed-postings-result";

describe("RetryFailedPostingsResultModel", () => {
  it("parses a fully-cleared outcome", () => {
    const model = RetryFailedPostingsResultModel.fromJson({
      period_id: "p-1",
      attempted: 3,
      cleared: 3,
      pending_after_retry: 0,
      still_failing: [],
    });
    expect(model.toEntity()).toEqual({
      periodId: "p-1",
      attempted: 3,
      cleared: 3,
      pendingAfterRetry: 0,
      stillFailing: [],
    });
  });

  it("parses still_failing entries through BlockingPostingModel", () => {
    const model = RetryFailedPostingsResultModel.fromJson({
      period_id: "p-1",
      attempted: 2,
      cleared: 1,
      pending_after_retry: 1,
      still_failing: [
        {
          source_table: "pos_sales",
          outbox_id: "ob-1",
          error_code: "OVERHEAD_ACCOUNT_AUTO_POSTING_REFUSED",
          coa_account: { id: "acc-1", code: "5100", name: "Beban Sewa" },
        },
      ],
    });
    const entity = model.toEntity();
    expect(entity.pendingAfterRetry).toBe(1);
    expect(entity.stillFailing).toHaveLength(1);
    expect(entity.stillFailing[0].coaAccount).toEqual({ id: "acc-1", code: "5100", name: "Beban Sewa" });
  });

  it("represents 'nothing was eligible to retry' honestly", () => {
    const model = RetryFailedPostingsResultModel.fromJson({
      period_id: "p-1",
      attempted: 0,
      cleared: 0,
      pending_after_retry: 0,
      still_failing: [],
    });
    expect(model.toEntity()).toEqual({ periodId: "p-1", attempted: 0, cleared: 0, pendingAfterRetry: 0, stillFailing: [] });
  });

  it("falls back to safe defaults on malformed input, without crashing", () => {
    const model = RetryFailedPostingsResultModel.fromJson({});
    expect(model.toEntity()).toEqual({ periodId: "", attempted: 0, cleared: 0, pendingAfterRetry: 0, stillFailing: [] });
  });

  it("renders a still_failing entry without an account when its coa_account is malformed", () => {
    // Regression: a partially-malformed coa_account (e.g. missing `name`) must never produce a
    // usable account here — otherwise the UI would render a blank " — " label and incorrectly
    // enable the retry-again remedy for an entry the server never actually resolved.
    const model = RetryFailedPostingsResultModel.fromJson({
      period_id: "p-1",
      attempted: 1,
      cleared: 0,
      pending_after_retry: 1,
      still_failing: [
        {
          source_table: "pos_sales",
          outbox_id: "ob-2",
          error_code: "OVERHEAD_ACCOUNT_AUTO_POSTING_REFUSED",
          coa_account: { id: "acc-1", code: "5100" }, // missing name
        },
      ],
    });
    expect(model.toEntity().stillFailing[0].coaAccount).toBeNull();
  });
});
