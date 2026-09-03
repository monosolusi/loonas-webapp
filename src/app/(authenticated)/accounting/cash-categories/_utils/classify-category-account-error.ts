import { ErrorCodes, ServerError } from "@/core/resources/server-error";

/**
 * Where a failed "Ubah Akun" submit surfaces. `account` renders beside the account picker
 * (the field the user can act on); `form` renders as the dialog-wide strip; `toast` is a
 * transport/permission-grade failure that names no field in this dialog.
 */
export type CategoryAccountErrorPlacement = "account" | "form" | "toast";

export type ClassifiedCategoryAccountError = {
  readonly code: string;
  readonly placement: CategoryAccountErrorPlacement;
  readonly message: string;
};

/**
 * Not in the shared `ErrorCodes` registry. `submitAccountEdit` never sends a `name` key — that is
 * the only way this 409 fires on `PATCH /accounting/cash-categories/{id}` — so it is unreachable in
 * practice, but handled defensively since it is a real code the endpoint can return.
 */
const CASH_CATEGORY_CURATED = "CASH_CATEGORY_CURATED";

/**
 * Sole owner of the `UNKNOWN`/`details.code` registry-fallback unwrap for this operation. This is
 * a deliberate duplicate of `cash-entries/new/_utils/classify-create-error.ts::unwrapCode` — same
 * one-liner, kept local so this page folder does not reach into a sibling page's `_utils/`.
 */
function unwrapCode(err: ServerError): string {
  return err.code === ErrorCodes.UNKNOWN.code ? (err.details?.code ?? err.code) : err.code;
}

/**
 * Pure `(ServerError) → outcome` for `PATCH /accounting/cash-categories/{id}` when the body is
 * `{account_id}` only — the general-row "Ubah Akun" dialog's sole write path. No body argument:
 * with exactly one field in the request, the code alone decides placement (this is why the deleted
 * standalone settings page's `classifySaveError`, which juggled two fields, was not reusable
 * as-is).
 */
export function classifyCategoryAccountError(err: ServerError): ClassifiedCategoryAccountError {
  const code = unwrapCode(err);

  if (code === ErrorCodes.CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH.code) {
    return { code, placement: "account", message: ErrorCodes.CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH.message };
  }

  if (code === ErrorCodes.CASH_CATEGORY_REFERENCED.code) {
    return {
      code,
      placement: "form",
      message:
        "Kategori ini sudah dipakai oleh entri kas yang tercatat, sehingga akunnya tidak dapat diganti saat ini.",
    };
  }

  if (code === CASH_CATEGORY_CURATED) {
    return { code, placement: "form", message: "Kategori bawaan ini tidak dapat diubah." };
  }

  if (code === ErrorCodes.CASH_CATEGORY_NOT_FOUND.code) {
    return { code, placement: "form", message: "Kategori kas tidak ditemukan. Muat ulang halaman ini." };
  }

  if (code === ErrorCodes.VALIDATION_FAILED.code) {
    return { code, placement: "account", message: "Akun yang dipilih tidak valid. Pilih akun lain." };
  }

  if (code === ErrorCodes.FORBIDDEN.code) {
    return { code, placement: "toast", message: "Anda tidak memiliki akses untuk mengubah kategori kas." };
  }

  return { code, placement: "toast", message: "Gagal mengubah akun kategori. Silakan coba lagi." };
}
