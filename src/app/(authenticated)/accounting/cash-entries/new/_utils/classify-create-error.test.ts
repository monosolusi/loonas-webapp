import { describe, expect, it } from "vitest";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import {
  classifyCreateCategoryError,
  classifyCreateError,
} from "@/app/(authenticated)/accounting/cash-entries/new/_utils/classify-create-error";

describe("classifyCreateError", () => {
  it("classifies PERIOD_CLOSED as a date-field error with copy telling the user what to do", () => {
    const result = classifyCreateError(new ServerError(ErrorCodes.PERIOD_CLOSED));
    expect(result.code).toBe(ErrorCodes.PERIOD_CLOSED.code);
    expect(result).toMatchObject({ placement: "field", field: "date" });
    expect(result.message).toBe("Periode untuk tanggal ini sudah ditutup. Pilih tanggal lain.");
  });

  it("classifies CASH_CATEGORY_NOT_FOUND as a form error with guidance, not the registry placeholder tone", () => {
    const result = classifyCreateError(new ServerError(ErrorCodes.CASH_CATEGORY_NOT_FOUND));
    expect(result.code).toBe(ErrorCodes.CASH_CATEGORY_NOT_FOUND.code);
    expect(result).toMatchObject({ placement: "form" });
    expect(result.message).toBe("Kategori kas tidak ditemukan. Pilih kategori lain.");
  });

  it("classifies CASH_CATEGORY_DIRECTION_MISMATCH as a form error about the category, not account types", () => {
    const result = classifyCreateError(new ServerError(ErrorCodes.CASH_CATEGORY_DIRECTION_MISMATCH));
    expect(result.code).toBe(ErrorCodes.CASH_CATEGORY_DIRECTION_MISMATCH.code);
    expect(result).toMatchObject({ placement: "form" });
    expect(result.message).toBe(
      "Kategori kas ini tidak dapat dipakai untuk arah kas yang dipilih. Pilih kategori lain.",
    );
  });

  it.each([
    [
      "JOURNAL_ACCOUNT_INVALID",
      "Akun pada kategori kas ini tidak valid untuk pencatatan jurnal. Perbarui kategori kas terlebih dahulu.",
    ],
    [
      "CASH_ACCOUNT_NOT_SEEDED",
      "Akun kas belum tersedia di sistem, sehingga entri kas tidak dapat dicatat. Hubungi dukungan Loonas.",
    ],
  ])("classifies the registry-absent code %s as a form error with its own copy", (code, message) => {
    // These codes are not in the FE registry, so they arrive as UNKNOWN + details.code.
    const err = new ServerError(ErrorCodes.UNKNOWN, { code });
    const result = classifyCreateError(err);
    expect(result.code).toBe(code);
    expect(result).toMatchObject({ placement: "form", message });
  });

  it("never instructs the user to open the deleted 'Pengaturan Kas' route for CASH_ACCOUNT_NOT_SEEDED", () => {
    const err = new ServerError(ErrorCodes.UNKNOWN, { code: "CASH_ACCOUNT_NOT_SEEDED" });
    const result = classifyCreateError(err);
    expect(result.message).not.toContain("Pengaturan Kas");
    expect(result.message).not.toContain("Buka");
  });

  it("classifies VALIDATION_FAILED as a form error with Indonesian copy, not the English registry message", () => {
    const result = classifyCreateError(new ServerError(ErrorCodes.VALIDATION_FAILED));
    expect(result.code).toBe(ErrorCodes.VALIDATION_FAILED.code);
    expect(result).toMatchObject({ placement: "form" });
    expect(result.message).not.toBe(ErrorCodes.VALIDATION_FAILED.message);
    expect(result.message).toBe("Data entri kas tidak valid. Periksa kembali isian formulir.");
  });

  it("classifies IDEMPOTENCY_KEY_REQUIRED as a form error reusing the registry copy", () => {
    const result = classifyCreateError(new ServerError(ErrorCodes.IDEMPOTENCY_KEY_REQUIRED));
    expect(result.code).toBe(ErrorCodes.IDEMPOTENCY_KEY_REQUIRED.code);
    expect(result).toMatchObject({ placement: "form", message: ErrorCodes.IDEMPOTENCY_KEY_REQUIRED.message });
  });

  it("falls back to toast for an unrecognized code, preserving the form", () => {
    const result = classifyCreateError(new ServerError(ErrorCodes.FORBIDDEN));
    expect(result.code).toBe(ErrorCodes.FORBIDDEN.code);
    expect(result).toMatchObject({ placement: "toast", message: "Gagal menyimpan entri kas. Silakan coba lagi." });
  });

  it("falls back to toast for a bare UNKNOWN with no details.code", () => {
    const result = classifyCreateError(new ServerError(ErrorCodes.UNKNOWN));
    expect(result.code).toBe(ErrorCodes.UNKNOWN.code);
    expect(result).toMatchObject({ placement: "toast" });
  });
});

describe("classifyCreateCategoryError", () => {
  it("classifies CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH as inline with the registry copy", () => {
    const result = classifyCreateCategoryError(new ServerError(ErrorCodes.CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH));
    expect(result.code).toBe(ErrorCodes.CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH.code);
    expect(result).toMatchObject({
      placement: "inline",
      message: ErrorCodes.CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH.message,
    });
  });

  it("classifies VALIDATION_FAILED as inline with dialog-scoped Indonesian copy", () => {
    const result = classifyCreateCategoryError(new ServerError(ErrorCodes.VALIDATION_FAILED));
    expect(result.code).toBe(ErrorCodes.VALIDATION_FAILED.code);
    expect(result).toMatchObject({ placement: "inline" });
    expect(result.message).toBe("Nama atau akun kategori tidak valid. Periksa kembali isian.");
  });

  it("unwraps a registry-fallback UNKNOWN via details.code before matching", () => {
    const err = new ServerError(ErrorCodes.UNKNOWN, { code: ErrorCodes.CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH.code });
    const result = classifyCreateCategoryError(err);
    expect(result.code).toBe(ErrorCodes.CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH.code);
    expect(result.placement).toBe("inline");
  });

  it("falls back to toast for an unrecognized code", () => {
    const result = classifyCreateCategoryError(new ServerError(ErrorCodes.FORBIDDEN));
    expect(result.code).toBe(ErrorCodes.FORBIDDEN.code);
    expect(result).toMatchObject({ placement: "toast", message: "Gagal menambahkan kategori kas. Silakan coba lagi." });
  });
});
