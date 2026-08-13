import { describe, expect, it } from "vitest";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { classifySubmitError } from "@/app/(user)/onboarding/user/_utils/classify-submit-error";

describe("classifySubmitError", () => {
  it("maps a USER_SIGNED_IN ServerError to a redirect outcome", () => {
    const outcome = classifySubmitError(new ServerError(ErrorCodes.USER_SIGNED_IN));

    expect(outcome).toEqual({ kind: "redirect-signed-in" });
  });

  it("maps any other ServerError to its own Indonesian message", () => {
    const outcome = classifySubmitError(new ServerError(ErrorCodes.UNKNOWN, { message: "Custom Clerk message" }));

    expect(outcome).toEqual({ kind: "error", message: "Custom Clerk message" });
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
});
