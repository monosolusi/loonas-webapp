import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export const ERROR_COPY_ACCOUNT_CREATION_FAILED =
  "Pembuatan akun gagal. Silakan coba lagi.";

export const ERROR_COPY_DUPLICATE_ENTRY =
  "Email atau informasi yang kamu masukkan sudah terdaftar. Gunakan data lain dan coba kembali.";

export const ERROR_COPY_NO_VALID_SESSION =
  "Sesi kamu sudah berakhir. Silakan muat ulang halaman dan coba lagi.";

export const ERROR_COPY_NETWORK_TIMEOUT =
  "Koneksi bermasalah. Pastikan kamu terhubung ke internet dan coba lagi.";

export const ERROR_COPY_GENERIC = "Terjadi kesalahan. Silakan coba lagi beberapa saat.";

export function mapSubmitError(err: unknown): string {
  if (err instanceof DOMException && (err.name === "AbortError" || err.name === "TimeoutError")) {
    return ERROR_COPY_NETWORK_TIMEOUT;
  }

  if (err instanceof ServerError) {
    switch (err.code) {
      case ErrorCodes.ACCOUNT_CREATION_FAILED.code:
        return ERROR_COPY_ACCOUNT_CREATION_FAILED;
      case ErrorCodes.DUPLICATE_ENTRY.code:
      case ErrorCodes.DUPLICATE_IDENTITY.code:
        return ERROR_COPY_DUPLICATE_ENTRY;
      case ErrorCodes.NO_VALID_SESSION.code:
        return ERROR_COPY_NO_VALID_SESSION;
      default:
        return ERROR_COPY_GENERIC;
    }
  }

  return ERROR_COPY_GENERIC;
}
