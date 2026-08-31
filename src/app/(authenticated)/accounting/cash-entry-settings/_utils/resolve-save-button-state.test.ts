import { describe, expect, it } from "vitest";
import { resolveSaveButtonState } from "@/app/(authenticated)/accounting/cash-entry-settings/_utils/resolve-save-button-state";
import { resolveSettingsFeedback } from "@/app/(authenticated)/accounting/cash-entry-settings/_utils/resolve-settings-feedback";
import { CashEntrySettingsFormState } from "@/app/(authenticated)/accounting/cash-entry-settings/_utils/resolve-settings-form-state";

const FORM_STATES: CashEntrySettingsFormState[] = [
  { status: "no-changes" },
  { status: "ready", body: { defaultIncomeAccountId: "acc-1" } },
  { status: "blocked", reason: "Akun default yang tersimpan tidak ditemukan." },
];

const CASES = FORM_STATES.flatMap((formState) => [false, true].map((isSaving) => ({ formState, isSaving })));

describe("resolveSaveButtonState", () => {
  it.each(FORM_STATES.map((formState) => [formState.status, formState] as const))(
    "enables only a ready, idle form (%s)",
    (_, formState) => {
      expect(resolveSaveButtonState({ formState, isSaving: false }).disabled).toBe(formState.status !== "ready");
    },
  );

  it("shows an in-flight label while saving — never a bare spinner", () => {
    const state = resolveSaveButtonState({ formState: FORM_STATES[1], isSaving: true });
    expect(state).toEqual({ disabled: true, loading: true, label: "Simpan", loadingLabel: "Menyimpan..." });
  });

  it.each(CASES.map(({ formState, isSaving }) => [formState.status, isSaving, formState, isSaving] as const))(
    "whenever the button is disabled and not loading, a feedback message explains it (%s, saving=%s)",
    (_, isSaving, formState) => {
      const button = resolveSaveButtonState({ formState, isSaving });
      if (!button.disabled || button.loading) return;
      expect(resolveSettingsFeedback(formState, null)).not.toBeNull();
    },
  );
});
