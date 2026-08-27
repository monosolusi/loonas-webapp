import { describe, expect, it } from "vitest";
import { classifyCancelError } from "@/app/(authenticated)/accounting/cash-entries/[id]/_utils/classify-cancel-error";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

describe("classifyCancelError", () => {
  it("classifies CASH_ENTRY_ALREADY_CANCELLED as inline with the registry's Indonesian copy", () => {
    const result = classifyCancelError(new ServerError(ErrorCodes.CASH_ENTRY_ALREADY_CANCELLED));
    expect(result.code).toBe(ErrorCodes.CASH_ENTRY_ALREADY_CANCELLED.code);
    expect(result.placement).toBe("inline");
    expect(result.message).toBe(ErrorCodes.CASH_ENTRY_ALREADY_CANCELLED.message);
  });

  it("classifies PERIOD_CLOSED as inline with the AC-6.8 copy naming today's period", () => {
    const result = classifyCancelError(new ServerError(ErrorCodes.PERIOD_CLOSED));
    expect(result.code).toBe(ErrorCodes.PERIOD_CLOSED.code);
    expect(result.placement).toBe("inline");
    expect(result.message).toBe("Periode untuk tanggal hari ini sudah ditutup, pembatalan tidak dapat dicatat.");
  });

  it("classifies NOT_FOUND as inline with our own Indonesian copy, not the registry placeholder", () => {
    const result = classifyCancelError(new ServerError(ErrorCodes.NOT_FOUND));
    expect(result.code).toBe(ErrorCodes.NOT_FOUND.code);
    expect(result.placement).toBe("inline");
    expect(result.message).not.toBe(ErrorCodes.NOT_FOUND.message);
    expect(result.message).toBe("Entri kas tidak ditemukan.");
  });

  it.each([
    ErrorCodes.IDEMPOTENCY_KEY_IN_PROGRESS,
    ErrorCodes.IDEMPOTENCY_KEY_CONFLICT,
    ErrorCodes.IDEMPOTENCY_KEY_REQUIRED,
  ])("classifies idempotency code $code as inline", (errorCode) => {
    const result = classifyCancelError(new ServerError(errorCode));
    expect(result.code).toBe(errorCode.code);
    expect(result.placement).toBe("inline");
    expect(result.message).toBe(errorCode.message);
  });

  it("unwraps a registry-fallback UNKNOWN via details.code — the code a caller branches on is the REAL code, not UNKNOWN", () => {
    const err = new ServerError(ErrorCodes.UNKNOWN, { code: ErrorCodes.PERIOD_CLOSED.code });
    const result = classifyCancelError(err);
    expect(result.code).toBe(ErrorCodes.PERIOD_CLOSED.code);
    expect(result.code).not.toBe(ErrorCodes.UNKNOWN.code);
    expect(result.placement).toBe("inline");
    expect(result.message).toBe("Periode untuk tanggal hari ini sudah ditutup, pembatalan tidak dapat dicatat.");
  });

  it("unwraps a registry-fallback UNKNOWN carrying CASH_ENTRY_ALREADY_CANCELLED — the exact case the provider's refetch branch keys off", () => {
    const err = new ServerError(ErrorCodes.UNKNOWN, { code: ErrorCodes.CASH_ENTRY_ALREADY_CANCELLED.code });
    const result = classifyCancelError(err);
    expect(result.code).toBe(ErrorCodes.CASH_ENTRY_ALREADY_CANCELLED.code);
    expect(result.placement).toBe("inline");
  });

  it("falls back to toast for an unrecognized code, preserving the form", () => {
    const result = classifyCancelError(new ServerError(ErrorCodes.FORBIDDEN));
    expect(result.code).toBe(ErrorCodes.FORBIDDEN.code);
    expect(result.placement).toBe("toast");
    expect(result.message).toBe("Gagal membatalkan entri kas. Silakan coba lagi.");
  });

  it("falls back to toast for a genuinely unknown code", () => {
    const result = classifyCancelError(new ServerError(ErrorCodes.UNKNOWN));
    expect(result.code).toBe(ErrorCodes.UNKNOWN.code);
    expect(result.placement).toBe("toast");
  });
});
