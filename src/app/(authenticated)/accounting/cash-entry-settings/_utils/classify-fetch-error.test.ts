import { describe, expect, it } from "vitest";
import { classifyFetchError } from "@/app/(authenticated)/accounting/cash-entry-settings/_utils/classify-fetch-error";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

describe("classifyFetchError", () => {
  it.each([ErrorCodes.FORBIDDEN, ErrorCodes.FEATURE_NOT_AVAILABLE])(
    "marks the FORBIDDEN class ($code) terminal — a 403 cannot succeed on retry",
    (errorCode) => {
      expect(classifyFetchError(new ServerError(errorCode)).retryable).toBe(false);
    },
  );

  it("unwraps a registry-fallback UNKNOWN via details.code before the terminal check", () => {
    const err = new ServerError(ErrorCodes.UNKNOWN, { code: ErrorCodes.FORBIDDEN.code });
    expect(classifyFetchError(err)).toEqual({ code: ErrorCodes.FORBIDDEN.code, retryable: false });
  });

  it.each([ErrorCodes.UNKNOWN, ErrorCodes.INVALID_INSTANCE, ErrorCodes.CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH])(
    "keeps every other failure retryable ($code)",
    (errorCode) => {
      expect(classifyFetchError(new ServerError(errorCode)).retryable).toBe(true);
    },
  );

  it("keeps an unregistered BE code retryable — the terminal set is extended, not guessed from the status", () => {
    const err = new ServerError(ErrorCodes.UNKNOWN, { code: "ROLE_NOT_GRANTED", status: 403 });
    expect(classifyFetchError(err)).toEqual({ code: "ROLE_NOT_GRANTED", retryable: true });
  });
});
