import { ErrorCodes, ServerError } from "@/core/resources/server-error";

/**
 * Curates a jargon-free Indonesian message for a close-period 422 error, shared by both
 * close-period entry points (`/accounting/periods` and `/accounting/fixed-costs`).
 *
 * `PERIOD_HAS_FAILED_POSTINGS` details are double-nested: `http-request.ts` forwards the
 * server's `details` payload as `{ details: data.details }`, and the `ServerError` constructor
 * `Object.assign`s that onto `this.details`, so the failed-postings count lives at
 * `err.details.details.failed_count` — not `err.details.failed_count`.
 */
export function resolveClosePeriodErrorMessage(err: ServerError): string {
  if (err.code === ErrorCodes.PERIOD_HAS_FAILED_POSTINGS.code) {
    const raw = err.details?.details?.failed_count;
    const count = typeof raw === "number" && Number.isFinite(raw) && raw >= 1 ? raw : null;
    if (count !== null) {
      return `Periode belum bisa dikunci. Ada ${count.toLocaleString("id-ID")} transaksi yang gagal tercatat ke pembukuan dan perlu diselesaikan sebelum periode ini bisa ditutup.`;
    }
    return ErrorCodes.PERIOD_HAS_FAILED_POSTINGS.message;
  }

  if (err.code === ErrorCodes.PPH_FINAL_NOT_POSTED.code) {
    return ErrorCodes.PPH_FINAL_NOT_POSTED.message;
  }

  return ErrorCodes.PERIOD_NOT_DRAINED.message;
}

/**
 * True when `err` is a `PERIOD_HAS_FAILED_POSTINGS` 422 — the only close-period error code that
 * feeds the consecutive-failure escalation counter in both providers.
 */
export function isPeriodHasFailedPostingsError(err: unknown): boolean {
  return (
    err instanceof ServerError &&
    err.httpCode === 422 &&
    err.code === ErrorCodes.PERIOD_HAS_FAILED_POSTINGS.code
  );
}
