import { describe, expect, it } from "vitest";
import { classifySaveError } from "@/app/(authenticated)/accounting/cash-entry-settings/_utils/classify-save-error";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

describe("classifySaveError", () => {
  it("places the account-type mismatch beside the income picker when only income was sent", () => {
    const err = new ServerError(ErrorCodes.CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH);
    const result = classifySaveError(err, { defaultIncomeAccountId: "acc-in" });
    expect(result.placement).toBe("income");
    expect(result.message).toBe(ErrorCodes.CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH.message);
  });

  it("places the account-type mismatch beside the expense picker when only expense was sent", () => {
    const result = classifySaveError(new ServerError(ErrorCodes.CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH), {
      defaultExpenseAccountId: null,
    });
    expect(result.placement).toBe("expense");
  });

  it("places the account-type mismatch at form level when both keys were sent — the body cannot name one field", () => {
    const result = classifySaveError(new ServerError(ErrorCodes.CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH), {
      defaultIncomeAccountId: "acc-in",
      defaultExpenseAccountId: "acc-out",
    });
    expect(result.placement).toBe("form");
  });

  it("unwraps a registry-fallback UNKNOWN via details.code — the placement decision keys off the REAL code", () => {
    const err = new ServerError(ErrorCodes.UNKNOWN, { code: ErrorCodes.CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH.code });
    const result = classifySaveError(err, { defaultExpenseAccountId: "acc-out" });
    expect(result.code).toBe(ErrorCodes.CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH.code);
    expect(result.placement).toBe("expense");
  });

  it.each([ErrorCodes.FORBIDDEN, ErrorCodes.UNKNOWN])(
    "sends every other code ($code) to a toast instead of a picker",
    (errorCode) => {
      const result = classifySaveError(new ServerError(errorCode), { defaultIncomeAccountId: "acc-in" });
      expect(result.placement).toBe("toast");
      expect(result.message).toBe("Gagal menyimpan pengaturan kas. Silakan coba lagi.");
    },
  );
});
