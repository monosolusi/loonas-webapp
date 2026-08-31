import { ErrorCodes, ServerError } from "@/core/resources/server-error";

/**
 * Where a failed cash-entry submit surfaces. `field` errors render next to the input they
 * name (PERIOD_CLOSED belongs beside the date the user picked); `form` errors render as the
 * form-wide strip above the submit control; `toast` errors are transport-grade failures that
 * describe no field.
 */
export type ClassifiedCreateError =
  | { readonly code: string; readonly placement: "field"; readonly field: "date"; readonly message: string }
  | { readonly code: string; readonly placement: "form"; readonly message: string }
  | { readonly code: string; readonly placement: "toast"; readonly message: string };

export type ClassifiedCreateCategoryError = {
  readonly code: string;
  placement: "inline" | "toast";
  message: string;
};

/**
 * Error codes this operation declares that the FE `ErrorCodes` registry does not carry. They
 * still arrive through the registry-fallback path (`UNKNOWN` + `details.code`), so they are
 * matched here as literals rather than added to the shared registry speculatively — the
 * create flow is their only FE consumer.
 */
const JOURNAL_ACCOUNT_INVALID = "JOURNAL_ACCOUNT_INVALID";
const CASH_ACCOUNT_NOT_SEEDED = "CASH_ACCOUNT_NOT_SEEDED";

/** Sole owner of the `UNKNOWN`/`details.code` registry-fallback unwrap — callers read `code` off the result. */
function unwrapCode(err: ServerError): string {
  return err.code === ErrorCodes.UNKNOWN.code ? (err.details?.code ?? err.code) : err.code;
}

/**
 * Pure `(ServerError) → outcome` for `POST /accounting/cash-entries`. Declared codes for this
 * operation: 400 VALIDATION_FAILED / IDEMPOTENCY_KEY_REQUIRED, 404 CASH_CATEGORY_NOT_FOUND,
 * 409 PERIOD_CLOSED, 422 CASH_CATEGORY_DIRECTION_MISMATCH / JOURNAL_ACCOUNT_INVALID, 500
 * CASH_ACCOUNT_NOT_SEEDED. Copy is overridden where the registry's generic or
 * category-scoped message would read wrong against an entry (the direction-mismatch copy is
 * about the CATEGORY not fitting the entry, not about account types).
 */
export function classifyCreateError(err: ServerError): ClassifiedCreateError {
  const code = unwrapCode(err);

  // The date is the field the user can act on — a closed period is fixed by picking another
  // date, so the message belongs beside it, not in a form-wide strip.
  if (code === ErrorCodes.PERIOD_CLOSED.code) {
    return {
      code,
      placement: "field",
      field: "date",
      message: "Periode untuk tanggal ini sudah ditutup. Pilih tanggal lain.",
    };
  }

  if (code === ErrorCodes.CASH_CATEGORY_NOT_FOUND.code) {
    return { code, placement: "form", message: "Kategori kas tidak ditemukan. Pilih kategori lain." };
  }

  if (code === ErrorCodes.CASH_CATEGORY_DIRECTION_MISMATCH.code) {
    return {
      code,
      placement: "form",
      message: "Kategori kas ini tidak dapat dipakai untuk arah kas yang dipilih. Pilih kategori lain.",
    };
  }

  if (code === JOURNAL_ACCOUNT_INVALID) {
    return {
      code,
      placement: "form",
      message: "Akun pada kategori kas ini tidak valid untuk pencatatan jurnal. Perbarui kategori kas terlebih dahulu.",
    };
  }

  if (code === CASH_ACCOUNT_NOT_SEEDED) {
    return {
      code,
      placement: "form",
      message: "Akun kas belum diatur. Buka Pengaturan Kas untuk mengaturnya terlebih dahulu.",
    };
  }

  if (code === ErrorCodes.VALIDATION_FAILED.code) {
    return { code, placement: "form", message: "Data entri kas tidak valid. Periksa kembali isian formulir." };
  }

  if (code === ErrorCodes.IDEMPOTENCY_KEY_REQUIRED.code) {
    return { code, placement: "form", message: err.message };
  }

  return { code, placement: "toast", message: "Gagal menyimpan entri kas. Silakan coba lagi." };
}

/**
 * Pure `(ServerError) → outcome` for `POST /accounting/cash-categories`, used by the
 * "Tambah kategori" dialog. The only business code the operation declares beyond
 * VALIDATION_FAILED is 422 CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH — surfaced inline because the
 * dialog is where the account can be corrected.
 */
export function classifyCreateCategoryError(err: ServerError): ClassifiedCreateCategoryError {
  const code = unwrapCode(err);

  if (code === ErrorCodes.CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH.code) {
    return { code, placement: "inline", message: err.message };
  }

  if (code === ErrorCodes.VALIDATION_FAILED.code) {
    return {
      code,
      placement: "inline",
      message: "Nama atau akun kategori tidak valid. Periksa kembali isian.",
    };
  }

  return { code, placement: "toast", message: "Gagal menambahkan kategori kas. Silakan coba lagi." };
}
