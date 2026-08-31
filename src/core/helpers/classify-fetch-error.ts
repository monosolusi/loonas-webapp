import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export type ClassifiedFetchError = {
  /** The unwrapped code — resolved through the `UNKNOWN`/`details.code` registry fallback so callers never re-derive it. */
  code: string;
  /** `false` for the FORBIDDEN class: resubmitting an identical request cannot succeed. */
  retryable: boolean;
};

/**
 * Every code a refusal means "retrying the same request cannot work". A refusal is about WHO is
 * asking, not about the request, so resubmitting can only fail again. Everything else (5xx,
 * transport, session) stays retryable — extend this set if the BE declares another 403 code on an
 * endpoint you consume. Genuinely per-endpoint terminal states (a `NOT_FOUND` the retry will only
 * hit again) stay with the caller: this helper owns only the cross-cutting auth/entitlement class.
 */
const TERMINAL_CODES: ReadonlySet<string> = new Set([
  ErrorCodes.FORBIDDEN.code,
  ErrorCodes.FEATURE_NOT_AVAILABLE.code,
]);

/**
 * Pure `(ServerError) → { code; retryable }` for deciding whether a failed fetch should offer a
 * retry affordance. Unwraps the registry fallback: when `HttpRequest` could not match the server's
 * code against `ErrorCodes`, it throws `UNKNOWN` and stashes the real code in `details.code` —
 * read that instead of trusting `err.code` at face value. Branch on the code, never on
 * `err.httpCode` (a static registry label, not the response status).
 */
export function classifyFetchError(err: ServerError): ClassifiedFetchError {
  const code = err.code === ErrorCodes.UNKNOWN.code ? (err.details?.code ?? err.code) : err.code;

  return { code, retryable: !TERMINAL_CODES.has(code) };
}
