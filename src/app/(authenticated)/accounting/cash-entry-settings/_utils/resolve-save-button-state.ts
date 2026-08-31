import { CashEntrySettingsFormState } from "@/app/(authenticated)/accounting/cash-entry-settings/_utils/resolve-settings-form-state";

export type CashEntrySettingsSaveButtonState = {
  disabled: boolean;
  loading: boolean;
  label: string;
  loadingLabel: string;
};

/**
 * Pure resolver for the save button — the form renders exactly what this returns and computes
 * nothing itself (house precedent: `create-account-button-state.ts`).
 *
 * Unlike that precedent the button IS gated on form completeness, because the two states that
 * gate it are ones the user cannot act on by clicking — a `missing` saved account blocks the save
 * outright, and "nothing changed" means there is no request to send. The rule that survives is
 * the one that matters: **`disabled && !loading` is always paired with a feedback message** from
 * `resolveSettingsFeedback` for the same state, so a grey button is never the only thing
 * explaining the block. Every `loading: true` carries a `loadingLabel`, because `Button` renders
 * `label` only when NOT loading — `loading` without one is a bare spinner with zero text.
 */
export function resolveSaveButtonState(input: {
  formState: CashEntrySettingsFormState;
  isSaving: boolean;
}): CashEntrySettingsSaveButtonState {
  return {
    disabled: input.formState.status !== "ready" || input.isSaving,
    loading: input.isSaving,
    label: "Simpan",
    loadingLabel: "Menyimpan...",
  };
}
