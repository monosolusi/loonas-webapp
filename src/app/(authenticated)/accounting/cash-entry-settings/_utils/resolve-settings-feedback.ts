import { CashEntrySettingsFormState } from "@/app/(authenticated)/accounting/cash-entry-settings/_utils/resolve-settings-form-state";

/** Where a save error renders — `SaveErrorPlacement` minus the `toast` variant, which never reaches the form. */
export type PlacedSaveError = {
  placement: "income" | "expense" | "form";
  message: string;
};

/** The strip's presentation props, resolved once so the component renders this object verbatim. */
export type CashEntrySettingsFeedbackMessage = {
  message: string;
  role: "alert" | undefined;
  className: string;
};

const ERROR_STRIP = { role: "alert" as const, className: "text-sm leading-5 text-red-500" };
const INFO_STRIP = { role: undefined, className: "text-sm leading-5 text-neutral-400" };
const NO_CHANGES_COPY = "Belum ada perubahan untuk disimpan.";

/**
 * Single owner of what the strip above the save button says, ranked by which fact is true right
 * now — one message slot, so at most one of these can render:
 *
 * 1. a save the form-state resolver has **blocked** outranks everything: it is the current reason
 *    the button is off, while a `saveError` describes a past attempt;
 * 2. **no changes** outranks a stale save error — after the user reverts an edit there is nothing
 *    left to send, and that is what explains the disabled button;
 * 3. a **form-placed save error** (a two-key body the 422 cannot be pinned to one field);
 * 4. otherwise nothing.
 */
export function resolveSettingsFeedback(
  formState: CashEntrySettingsFormState,
  saveError: PlacedSaveError | null,
): CashEntrySettingsFeedbackMessage | null {
  if (formState.status === "blocked") return { message: formState.reason, ...ERROR_STRIP };
  if (formState.status === "no-changes") return { message: NO_CHANGES_COPY, ...INFO_STRIP };
  if (saveError?.placement === "form") return { message: saveError.message, ...ERROR_STRIP };
  return null;
}

/** The save error beside one picker — `null` unless the 422 was placed on that field. */
export function resolveFieldSaveError(
  saveError: PlacedSaveError | null,
  placement: Exclude<PlacedSaveError["placement"], "form">,
): string | null {
  return saveError?.placement === placement ? saveError.message : null;
}
