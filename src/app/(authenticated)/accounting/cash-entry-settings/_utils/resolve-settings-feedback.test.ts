import { describe, expect, it } from "vitest";
import {
  resolveFieldSaveError,
  resolveSettingsFeedback,
} from "@/app/(authenticated)/accounting/cash-entry-settings/_utils/resolve-settings-feedback";
import { CashEntrySettingsFormState } from "@/app/(authenticated)/accounting/cash-entry-settings/_utils/resolve-settings-form-state";

const READY: CashEntrySettingsFormState = { status: "ready", body: { defaultIncomeAccountId: "acc-1" } };
const BLOCKED: CashEntrySettingsFormState = { status: "blocked", reason: "Akun default tidak ditemukan." };
const FORM_ERROR = { placement: "form" as const, message: "Tipe akun tidak sesuai." };
const INCOME_ERROR = { placement: "income" as const, message: "Tipe akun tidak sesuai." };

describe("resolveSettingsFeedback", () => {
  it("renders nothing on an editable form with no error", () => {
    expect(resolveSettingsFeedback(READY, null)).toBeNull();
  });

  it("renders the blocked reason as an alert — the current blocker outranks a past attempt", () => {
    expect(resolveSettingsFeedback(BLOCKED, FORM_ERROR)).toEqual({
      message: BLOCKED.reason,
      role: "alert",
      className: "text-sm leading-5 text-red-500",
    });
  });

  it("renders no-changes as neutral info, outranking a stale save error", () => {
    expect(resolveSettingsFeedback({ status: "no-changes" }, FORM_ERROR)).toEqual({
      message: "Belum ada perubahan untuk disimpan.",
      role: undefined,
      className: "text-sm leading-5 text-neutral-400",
    });
  });

  it("renders a form-placed save error as an alert", () => {
    expect(resolveSettingsFeedback(READY, FORM_ERROR)).toEqual({
      message: FORM_ERROR.message,
      role: "alert",
      className: "text-sm leading-5 text-red-500",
    });
  });

  it("ignores a save error placed on a field — that one renders beside its picker", () => {
    expect(resolveSettingsFeedback(READY, INCOME_ERROR)).toBeNull();
  });
});

describe("resolveFieldSaveError", () => {
  it("returns the message only for the placement it was filed under", () => {
    expect(resolveFieldSaveError(INCOME_ERROR, "income")).toBe(INCOME_ERROR.message);
    expect(resolveFieldSaveError(INCOME_ERROR, "expense")).toBeNull();
  });
});
