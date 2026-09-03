import { describe, expect, it } from "vitest";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { classifyCategoryAccountError } from "@/app/(authenticated)/accounting/cash-categories/_utils/classify-category-account-error";

describe("classifyCategoryAccountError", () => {
  it("classifies CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH as account-placed with the registry copy", () => {
    const result = classifyCategoryAccountError(new ServerError(ErrorCodes.CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH));
    expect(result.code).toBe(ErrorCodes.CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH.code);
    expect(result).toMatchObject({
      placement: "account",
      message: ErrorCodes.CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH.message,
    });
  });

  it("classifies CASH_CATEGORY_REFERENCED as a form error promising no retry", () => {
    const result = classifyCategoryAccountError(new ServerError(ErrorCodes.CASH_CATEGORY_REFERENCED));
    expect(result.code).toBe(ErrorCodes.CASH_CATEGORY_REFERENCED.code);
    expect(result).toMatchObject({
      placement: "form",
      message:
        "Kategori ini sudah dipakai oleh entri kas yang tercatat, sehingga akunnya tidak dapat diganti saat ini.",
    });
  });

  it("classifies the registry-absent CASH_CATEGORY_CURATED as a form error", () => {
    // Not in the FE registry — arrives as UNKNOWN + details.code.
    const err = new ServerError(ErrorCodes.UNKNOWN, { code: "CASH_CATEGORY_CURATED" });
    const result = classifyCategoryAccountError(err);
    expect(result.code).toBe("CASH_CATEGORY_CURATED");
    expect(result).toMatchObject({ placement: "form", message: "Kategori bawaan ini tidak dapat diubah." });
  });

  it("classifies CASH_CATEGORY_NOT_FOUND as a form error instructing a reload", () => {
    const result = classifyCategoryAccountError(new ServerError(ErrorCodes.CASH_CATEGORY_NOT_FOUND));
    expect(result.code).toBe(ErrorCodes.CASH_CATEGORY_NOT_FOUND.code);
    expect(result).toMatchObject({
      placement: "form",
      message: "Kategori kas tidak ditemukan. Muat ulang halaman ini.",
    });
  });

  it("classifies VALIDATION_FAILED as account-placed with dialog-scoped Indonesian copy", () => {
    const result = classifyCategoryAccountError(new ServerError(ErrorCodes.VALIDATION_FAILED));
    expect(result.code).toBe(ErrorCodes.VALIDATION_FAILED.code);
    expect(result).toMatchObject({ placement: "account", message: "Akun yang dipilih tidak valid. Pilih akun lain." });
  });

  it("classifies FORBIDDEN as a toast", () => {
    const result = classifyCategoryAccountError(new ServerError(ErrorCodes.FORBIDDEN));
    expect(result.code).toBe(ErrorCodes.FORBIDDEN.code);
    expect(result).toMatchObject({
      placement: "toast",
      message: "Anda tidak memiliki akses untuk mengubah kategori kas.",
    });
  });

  it("falls back to toast for an unrecognized code", () => {
    const result = classifyCategoryAccountError(new ServerError(ErrorCodes.PERIOD_CLOSED));
    expect(result.code).toBe(ErrorCodes.PERIOD_CLOSED.code);
    expect(result).toMatchObject({ placement: "toast", message: "Gagal mengubah akun kategori. Silakan coba lagi." });
  });

  it("falls back to toast for a bare UNKNOWN with no details.code", () => {
    const result = classifyCategoryAccountError(new ServerError(ErrorCodes.UNKNOWN));
    expect(result.code).toBe(ErrorCodes.UNKNOWN.code);
    expect(result).toMatchObject({ placement: "toast" });
  });

  it("unwraps a registry-fallback UNKNOWN via details.code before matching", () => {
    const err = new ServerError(ErrorCodes.UNKNOWN, { code: ErrorCodes.CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH.code });
    const result = classifyCategoryAccountError(err);
    expect(result.code).toBe(ErrorCodes.CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH.code);
    expect(result.placement).toBe("account");
  });
});
