import { describe, expect, it } from "vitest";
import {
  CAPTCHA_UNAVAILABLE_MESSAGE,
  EMAIL_EXISTS_MESSAGE,
  GENERIC_ERROR_MESSAGE,
  PASSWORD_PWNED_MESSAGE,
  PASSWORD_REJECTED_MESSAGE,
  RATE_LIMITED_MESSAGE,
  classifySubmitError,
} from "@/app/(user)/onboarding/user/_utils/classify-submit-error";

describe("classifySubmitError", () => {
  // The banner hand-splits this sentence around a <Link> on "Masuk ke akun Anda". Nothing else
  // couples the two, so this guards the copy from drifting out from under the markup.
  it("keeps the email-exists copy containing the phrase the banner hyperlinks", () => {
    expect(EMAIL_EXISTS_MESSAGE).toContain("Masuk ke akun Anda");
  });

  it("maps a native Error to the generic fallback message", () => {
    const outcome = classifySubmitError(new Error("network exploded"));

    expect(outcome).toEqual({ kind: "error", message: "Gagal membuat akun. Silakan coba lagi." });
  });

  it("maps a thrown string to the generic fallback message", () => {
    const outcome = classifySubmitError("just a string");

    expect(outcome).toEqual({ kind: "error", message: "Gagal membuat akun. Silakan coba lagi." });
  });

  it("maps null to the generic fallback message", () => {
    const outcome = classifySubmitError(null);

    expect(outcome).toEqual({ kind: "error", message: "Gagal membuat akun. Silakan coba lagi." });
  });

  it("maps undefined to the generic fallback message", () => {
    const outcome = classifySubmitError(undefined);

    expect(outcome).toEqual({ kind: "error", message: "Gagal membuat akun. Silakan coba lagi." });
  });

  it("maps a Clerk API session_exists error to a redirect outcome", () => {
    const outcome = classifySubmitError({ status: 422, errors: [{ code: "session_exists" }] });

    expect(outcome).toEqual({ kind: "redirect-signed-in" });
  });

  it("maps a Clerk API form_identifier_exists error to the email-exists outcome", () => {
    const outcome = classifySubmitError({ status: 422, errors: [{ code: "form_identifier_exists" }] });

    expect(outcome).toEqual({ kind: "email-exists", message: EMAIL_EXISTS_MESSAGE });
  });

  it("maps the form_password_pwned code to its own dedicated copy", () => {
    const outcome = classifySubmitError({ status: 422, errors: [{ code: "form_password_pwned" }] });

    expect(outcome).toEqual({ kind: "error", message: PASSWORD_PWNED_MESSAGE });
  });

  it.each([
    "form_password_not_strong_enough",
    "form_password_length_too_short",
    "form_password_no_uppercase",
    "form_password_no_lowercase",
    "form_password_no_number",
    "form_password_no_special_char",
  ])("maps the Clerk password error code %s to the generic password-rejected copy", (code) => {
    const outcome = classifySubmitError({ status: 422, errors: [{ code }] });

    expect(outcome).toEqual({ kind: "error", message: PASSWORD_REJECTED_MESSAGE });
  });

  it("maps a 429 status to the rate-limited copy when no retryAfter is present", () => {
    const outcome = classifySubmitError({ status: 429, errors: [{ code: "some_throttle_code" }] });

    expect(outcome).toEqual({ kind: "error", message: RATE_LIMITED_MESSAGE });
  });

  it("maps a too_many_requests code to the rate-limited copy even off a non-429 status", () => {
    const outcome = classifySubmitError({ status: 400, errors: [{ code: "too_many_requests" }] });

    expect(outcome).toEqual({ kind: "error", message: RATE_LIMITED_MESSAGE });
  });

  it("appends the wait time to the rate-limited copy when retryAfter is present", () => {
    const outcome = classifySubmitError({ status: 429, errors: [{ code: "too_many_requests" }], retryAfter: 30 });

    expect(outcome).toEqual({ kind: "error", message: `${RATE_LIMITED_MESSAGE} Coba lagi dalam 30 detik.` });
  });

  it("omits the wait-time hint cleanly when retryAfter is absent", () => {
    const outcome = classifySubmitError({ status: 429, errors: [{ code: "too_many_requests" }] });

    expect((outcome as { message: string }).message).not.toContain("detik");
  });

  it("falls through an unknown Clerk API error code to the generic message", () => {
    const outcome = classifySubmitError({ status: 422, errors: [{ code: "some_unrecognized_code" }] });

    expect(outcome).toEqual({ kind: "error", message: GENERIC_ERROR_MESSAGE });
  });

  it("maps a ClerkRuntimeError-shaped captcha_unavailable error to connection copy", () => {
    const outcome = classifySubmitError({ code: "captcha_unavailable", message: "captcha unavailable" });

    expect(outcome).toEqual({ kind: "error", message: CAPTCHA_UNAVAILABLE_MESSAGE });
  });

  it("falls through an unknown ClerkRuntimeError-shaped code to the generic message", () => {
    const outcome = classifySubmitError({ code: "some_other_runtime_code", message: "whatever" });

    expect(outcome).toEqual({ kind: "error", message: GENERIC_ERROR_MESSAGE });
  });
});
