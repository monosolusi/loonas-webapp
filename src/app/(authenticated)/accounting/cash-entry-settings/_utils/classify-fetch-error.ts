import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export type ClassifiedFetchError = {
  /** The unwrapped code — resolved through the `UNKNOWN`/`details.code` registry fallback so callers never re-derive it. */
  code: string;
  /** `false` for the FORBIDDEN class: the GET contract declares only 200/403, and a 403 cannot succeed on retry. */
  retryable: boolean;
};

/**
 * Every code these GETs can refuse the caller with. A refusal is about WHO is asking, not about
 * the request, so resubmitting can only fail again. `CashEntryFeatureGate` renders the feature-flag
 * case before this page mounts, so what reaches the error state is a role/permission 403 that
 * slipped past it. Everything else (5xx, transport, session) stays retryable — extend this set if
 * the BE declares another 403 code on the endpoint.
 */
const TERMINAL_CODES: ReadonlySet<string> = new Set([
  ErrorCodes.FORBIDDEN.code,
  ErrorCodes.FEATURE_NOT_AVAILABLE.code,
]);

/**
 * Pure `(ServerError) → { code; retryable }` for the page's load path — the twin of
 * `classifySaveError` for the save path. Unwraps the registry fallback the same way: when
 * `HttpRequest` could not match the server's code against `ErrorCodes`, it throws `UNKNOWN` and
 * stashes the real code in `details.code` — read that instead of trusting `err.code` at face
 * value. Branch on the code, never on `err.httpCode` (a static registry label, not the response
 * status).
 */
export function classifyFetchError(err: ServerError): ClassifiedFetchError {
  const code = err.code === ErrorCodes.UNKNOWN.code ? (err.details?.code ?? err.code) : err.code;

  return { code, retryable: !TERMINAL_CODES.has(code) };
}
