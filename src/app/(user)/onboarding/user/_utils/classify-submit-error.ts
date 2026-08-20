export type SubmitOutcome =
  | { kind: "redirect-signed-in" }
  | { kind: "email-exists"; message: string }
  | { kind: "error"; message: string };

/** The subset of `SubmitOutcome` that is actually stored as form error state — a redirect never is. */
export type SubmitError = { kind: "email-exists"; message: string } | { kind: "error"; message: string };

export const GENERIC_ERROR_MESSAGE = "Gagal membuat akun. Silakan coba lagi.";

export const CAPTCHA_UNAVAILABLE_MESSAGE =
  "Verifikasi keamanan tidak dapat dimuat. Periksa koneksi kamu atau nonaktifkan pemblokir iklan, lalu coba lagi.";

export const RATE_LIMITED_MESSAGE = "Terlalu banyak percobaan. Silakan tunggu beberapa saat, lalu coba lagi.";

export const PASSWORD_PWNED_MESSAGE =
  "Kata sandi ini pernah ditemukan pada kebocoran data dan tidak dapat digunakan. Gunakan kata sandi lain yang belum pernah dipakai di layanan lain.";

export const PASSWORD_REJECTED_MESSAGE = "Kata sandi tidak memenuhi syarat keamanan. Gunakan kombinasi lain.";

/** Verbatim copy — also used by `create-user-error-banner.tsx`, which hyperlinks the phrase
 * "Masuk ke akun Anda" inside this exact sentence. Keep both in sync if this string ever changes. */
export const EMAIL_EXISTS_MESSAGE =
  "Email ini sudah terdaftar. Masuk ke akun Anda, atau gunakan email lain untuk mendaftar.";

// Used directly by `_providers/create-user.tsx` — these two outcomes depend on which submit
// step failed (a fact `classifySubmitError` can't see from the error alone), so they never flow
// through the classifier below.
export const EMAIL_VERIFICATION_REQUIRED_MESSAGE =
  "Akun kamu perlu verifikasi email yang belum didukung di halaman ini. Hubungi dukungan Loonas.";
export const SET_ACTIVE_FAILED_AFTER_CREATE_MESSAGE =
  "Akun kamu sudah dibuat, tapi sesi gagal diaktifkan. Muat ulang halaman lalu masuk.";

const PASSWORD_PWNED_CODE = "form_password_pwned";

const OTHER_PASSWORD_ERROR_CODES = new Set([
  "form_password_not_strong_enough",
  "form_password_length_too_short",
  "form_password_no_uppercase",
  "form_password_no_lowercase",
  "form_password_no_number",
  "form_password_no_special_char",
]);

// Structural (duck-typed) shape for Clerk's API error class — NOT imported from `@clerk/*`.
// This module must stay reachable by the node-env vitest suite, and this is the house pattern
// (`sign-in.tsx`'s `classifyClerkError`). Do not "helpfully" add a `@clerk/nextjs` import back.
//
// Note: neither Clerk call in `_providers/create-user.tsx` routes a `DOMException` timeout
// through this classifier. `signUp.create()` is awaited directly with no client-side deadline —
// see `createSession()`'s doc comment for why racing it is unsafe. `setActive()` IS bounded by
// `withTimeout()`, but `activateSession()` catches that itself (a timeout there is
// indistinguishable in outcome from any other `setActive()` failure — the account is already
// known-created either way) and never rethrows into this classifier. A stalled *creation* is
// instead surfaced by the below-button status notice reading elapsed time, not a caught error.
type ClerkApiLikeError = { status: number; errors: Array<{ code?: unknown }>; retryAfter?: number };
type ClerkRuntimeLikeError = { code: string };

function isClerkApiLikeError(err: unknown): err is ClerkApiLikeError {
  if (typeof err !== "object" || err === null) return false;
  const candidate = err as Record<string, unknown>;
  return typeof candidate.status === "number" && Array.isArray(candidate.errors);
}

function isClerkRuntimeLikeError(err: unknown): err is ClerkRuntimeLikeError {
  if (typeof err !== "object" || err === null) return false;
  const candidate = err as Record<string, unknown>;
  return typeof candidate.code === "string" && !Array.isArray(candidate.errors) && typeof candidate.status !== "number";
}

function buildRateLimitedMessage(retryAfterSeconds: unknown): string {
  if (typeof retryAfterSeconds !== "number" || retryAfterSeconds <= 0) return RATE_LIMITED_MESSAGE;
  return `${RATE_LIMITED_MESSAGE} Coba lagi dalam ${retryAfterSeconds} detik.`;
}

/**
 * Maps a caught `createUser()` error to a form outcome. Pure — no React, no Clerk imports,
 * no I/O — so the provider can switch on the result instead of throwing from an async handler.
 */
export function classifySubmitError(err: unknown): SubmitOutcome {
  if (isClerkApiLikeError(err)) {
    const code = err.errors[0]?.code;

    // Rate limiting is checked FIRST: the HTTP status is authoritative, so it must not be
    // pre-empted by a pattern-matched `code` from `errors[0]`.
    if (err.status === 429 || code === "too_many_requests") {
      return { kind: "error", message: buildRateLimitedMessage(err.retryAfter) };
    }
    if (code === "session_exists") return { kind: "redirect-signed-in" };
    if (code === "form_identifier_exists") return { kind: "email-exists", message: EMAIL_EXISTS_MESSAGE };
    if (code === PASSWORD_PWNED_CODE) return { kind: "error", message: PASSWORD_PWNED_MESSAGE };
    if (typeof code === "string" && OTHER_PASSWORD_ERROR_CODES.has(code)) {
      return { kind: "error", message: PASSWORD_REJECTED_MESSAGE };
    }
    return { kind: "error", message: GENERIC_ERROR_MESSAGE };
  }

  if (isClerkRuntimeLikeError(err)) {
    if (err.code === "captcha_unavailable") return { kind: "error", message: CAPTCHA_UNAVAILABLE_MESSAGE };
    return { kind: "error", message: GENERIC_ERROR_MESSAGE };
  }

  return { kind: "error", message: GENERIC_ERROR_MESSAGE };
}
