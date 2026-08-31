import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { CashEntrySettingsPatchBody } from "@/app/(authenticated)/accounting/cash-entry-settings/_utils/resolve-settings-form-state";

/** Where a save error renders: beside one picker, at form level, or as a toast. */
export type SaveErrorPlacement = "income" | "expense" | "form" | "toast";

export type ClassifiedSaveError = {
  /** The unwrapped code — resolved through the `UNKNOWN`/`details.code` registry fallback so callers never re-derive it. */
  code: string;
  placement: SaveErrorPlacement;
  message: string;
};

/**
 * The PATCH declares exactly one business error: 422 `CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH` (the
 * settings endpoint carries no 409 and no idempotency contract — LNS-759). That one is shown
 * inline because the user can act on it immediately, and it is placed beside the picker the sent
 * body was about: a one-key body names its field, a two-key body cannot, so it lands at form
 * level rather than guessing. Branch on the unwrapped `details.code`, never on
 * `err.httpCode` — that field is a static registry label, not the response status.
 */
export function classifySaveError(err: ServerError, body: CashEntrySettingsPatchBody): ClassifiedSaveError {
  const code = err.code === ErrorCodes.UNKNOWN.code ? (err.details?.code ?? err.code) : err.code;

  if (code === ErrorCodes.CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH.code) {
    return { code, placement: resolveMismatchPlacement(body), message: err.message };
  }

  return { code, placement: "toast", message: "Gagal menyimpan pengaturan kas. Silakan coba lagi." };
}

function resolveMismatchPlacement(body: CashEntrySettingsPatchBody): "income" | "expense" | "form" {
  const changedIncome = body.defaultIncomeAccountId !== undefined;
  const changedExpense = body.defaultExpenseAccountId !== undefined;
  if (changedIncome && !changedExpense) return "income";
  if (changedExpense && !changedIncome) return "expense";
  return "form";
}
