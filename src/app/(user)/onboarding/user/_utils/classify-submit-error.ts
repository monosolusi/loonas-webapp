import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export type SubmitOutcome = { kind: "redirect-signed-in" } | { kind: "error"; message: string };

const GENERIC_ERROR_MESSAGE = "Gagal membuat akun. Silakan coba lagi.";

/**
 * Maps a caught `createUser()` error to a form outcome. Pure — no React, no Clerk imports,
 * no I/O — so `onSubmit` can switch on the result instead of throwing from an async handler.
 */
export function classifySubmitError(err: unknown): SubmitOutcome {
  if (err instanceof ServerError) {
    if (err.code === ErrorCodes.USER_SIGNED_IN.code) return { kind: "redirect-signed-in" };
    return { kind: "error", message: err.message };
  }

  return { kind: "error", message: GENERIC_ERROR_MESSAGE };
}
