import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export type ClassifiedCancelError = {
  /** The unwrapped code — resolved through the `UNKNOWN`/`details.code` registry fallback so
   *  callers never need to re-derive it themselves. */
  code: string;
  placement: "inline" | "toast";
  message: string;
};

// Every code shown inline instead of via toast. The idempotency codes are surfaced inline
// because they describe a state of THIS attempt (a duplicate or in-flight request), not a
// generic transport failure, and the user should see it beside the form they just submitted.
const INLINE_CODES: ReadonlySet<string> = new Set([
  ErrorCodes.CASH_ENTRY_ALREADY_CANCELLED.code,
  ErrorCodes.PERIOD_CLOSED.code,
  ErrorCodes.NOT_FOUND.code,
  ErrorCodes.IDEMPOTENCY_KEY_IN_PROGRESS.code,
  ErrorCodes.IDEMPOTENCY_KEY_CONFLICT.code,
  ErrorCodes.IDEMPOTENCY_KEY_REQUIRED.code,
]);

/**
 * Pure `(ServerError) → { code; placement; message }`. Unwraps the registry fallback the same
 * way `journal-detail-provider.tsx`'s `mapServerError` does: when `HttpRequest` could not match
 * the server's code against `ErrorCodes`, it throws `UNKNOWN` and stashes the real code in
 * `details.code` — read that instead of trusting `err.code` at face value. This is the SOLE
 * owner of that unwrap — callers (e.g. the provider's refetch-on-already-cancelled branch) read
 * `code` off the result instead of re-deriving it.
 */
export function classifyCancelError(err: ServerError): ClassifiedCancelError {
  const code = err.code === ErrorCodes.UNKNOWN.code ? (err.details?.code ?? err.code) : err.code;

  // PERIOD_CLOSED — AC-6.8: no reversal is recorded, and the reason (today's period is closed)
  // is specific enough to spell out rather than reuse the registry's generic message.
  if (code === ErrorCodes.PERIOD_CLOSED.code) {
    return {
      code,
      placement: "inline",
      message: "Periode untuk tanggal hari ini sudah ditutup, pembatalan tidak dapat dicatat.",
    };
  }

  // NOT_FOUND ships the English placeholder "Not found" in the registry — override with our
  // own Indonesian copy.
  if (code === ErrorCodes.NOT_FOUND.code) {
    return { code, placement: "inline", message: "Entri kas tidak ditemukan." };
  }

  if (INLINE_CODES.has(code)) {
    return { code, placement: "inline", message: err.message };
  }

  return { code, placement: "toast", message: "Gagal membatalkan entri kas. Silakan coba lagi." };
}
