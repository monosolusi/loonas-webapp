import { describe, expect, it } from "vitest";
import {
  CashEntrySettingsSelection,
  resolveSavedSelection,
  resolveSelectedAccount,
  resolveSettingsFormState,
  SavedCashEntrySettings,
} from "@/app/(authenticated)/accounting/cash-entry-settings/_utils/resolve-settings-form-state";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { AccountType } from "@/features/accounting/domain/enums/account-type";

const SAVED: SavedCashEntrySettings = { defaultIncomeAccountId: "acc-in", defaultExpenseAccountId: "acc-out" };

const EMPTY: CashEntrySettingsSelection = { kind: "empty" };
const keeps = (accountId: string): CashEntrySettingsSelection => ({ kind: "account", accountId });

describe("resolveSavedSelection", () => {
  it("resolves to empty when no default was ever saved", () => {
    expect(resolveSavedSelection(null, [account("acc-1")])).toEqual({ kind: "empty" });
  });

  it("resolves to empty while the account list has not loaded, never to missing", () => {
    expect(resolveSavedSelection("acc-in", null)).toEqual({ kind: "empty" });
  });

  it("resolves a saved id the list carries to a concrete account selection", () => {
    expect(resolveSavedSelection("acc-in", [account("acc-in")])).toEqual({ kind: "account", accountId: "acc-in" });
  });

  it("resolves a saved id the list does not carry to missing — never to an empty combobox", () => {
    expect(resolveSavedSelection("acc-in", [account("acc-out")])).toEqual({ kind: "missing", savedId: "acc-in" });
  });
});

describe("resolveSelectedAccount", () => {
  it("finds the entity behind an account selection", () => {
    const entity = account("acc-in");
    expect(resolveSelectedAccount({ kind: "account", accountId: "acc-in" }, [entity])).toBe(entity);
  });

  it("returns null for empty and missing selections alike", () => {
    expect(resolveSelectedAccount({ kind: "empty" }, [account("acc-in")])).toBeNull();
    expect(resolveSelectedAccount({ kind: "missing", savedId: "acc-in" }, [account("acc-out")])).toBeNull();
  });
});

describe("resolveSettingsFormState", () => {
  it("short-circuits to no-changes when both pickers still hold their saved values", () => {
    const state = resolveSettingsFormState(SAVED, keeps("acc-in"), keeps("acc-out"));
    expect(state.status).toBe("no-changes");
  });

  it("treats an empty picker over an already-null default as no-changes, not as a clear", () => {
    const state = resolveSettingsFormState(
      { defaultIncomeAccountId: null, defaultExpenseAccountId: null },
      EMPTY,
      EMPTY,
    );
    expect(state.status).toBe("no-changes");
  });

  it("sends only the changed key — the unchanged one is absent from the SERIALIZED body", () => {
    const state = resolveSettingsFormState(SAVED, keeps("acc-in-2"), keeps("acc-out"));
    expect(state.status).toBe("ready");
    if (state.status !== "ready") return;
    const serialized = JSON.stringify(state.body);
    expect(serialized).toContain('"defaultIncomeAccountId":"acc-in-2"');
    expect(serialized).not.toContain("defaultExpenseAccountId");
    expect(serialized).toBe('{"defaultIncomeAccountId":"acc-in-2"}');
  });

  it("serializes a cleared key as an explicit null, never an omitted key", () => {
    const state = resolveSettingsFormState(SAVED, { kind: "empty" }, keeps("acc-out"));
    expect(state.status).toBe("ready");
    if (state.status !== "ready") return;
    const serialized = JSON.stringify(state.body);
    expect(serialized).toContain('"defaultIncomeAccountId":null');
    expect(serialized).toBe('{"defaultIncomeAccountId":null}');
  });

  it("carries both keys when both defaults changed", () => {
    const state = resolveSettingsFormState(SAVED, keeps("acc-in-2"), keeps("acc-out-2"));
    expect(state.status).toBe("ready");
    if (state.status !== "ready") return;
    expect(JSON.stringify(state.body)).toBe(
      '{"defaultIncomeAccountId":"acc-in-2","defaultExpenseAccountId":"acc-out-2"}',
    );
  });

  it("counts clearing a saved default as a change, and clearing an already-null one as nothing", () => {
    const clearingSaved = resolveSettingsFormState(
      { defaultIncomeAccountId: "acc-in", defaultExpenseAccountId: null },
      { kind: "empty" },
      { kind: "empty" },
    );
    expect(clearingSaved.status).toBe("ready");
    if (clearingSaved.status === "ready") {
      expect(JSON.stringify(clearingSaved.body)).toBe('{"defaultIncomeAccountId":null}');
    }

    const clearingNothing = resolveSettingsFormState(
      { defaultIncomeAccountId: null, defaultExpenseAccountId: "acc-out" },
      { kind: "empty" },
      keeps("acc-out"),
    );
    expect(clearingNothing.status).toBe("no-changes");
  });

  it("blocks the save while a saved id is missing from the account list", () => {
    const state = resolveSettingsFormState(SAVED, { kind: "missing", savedId: "acc-in" }, keeps("acc-out"));
    expect(state.status).toBe("blocked");
    if (state.status !== "blocked") return;
    expect(state.reason).toContain("tidak ditemukan");
  });

  it("unblocks once the user re-picks the missing default, carrying it as a change", () => {
    const state = resolveSettingsFormState(SAVED, keeps("acc-in-2"), keeps("acc-out"));
    expect(state.status).toBe("ready");
  });

  it("unblocks once the user clears the missing default, sending an explicit null", () => {
    const state = resolveSettingsFormState(SAVED, { kind: "empty" }, keeps("acc-out"));
    expect(state.status).toBe("ready");
    if (state.status !== "ready") return;
    expect(JSON.stringify(state.body)).toBe('{"defaultIncomeAccountId":null}');
  });
});

function account(id: string): LedgerAccountEntity {
  return new LedgerAccountEntity({
    id,
    code: "4100",
    name: `Akun ${id}`,
    type: AccountType.REVENUE,
    parentId: null,
    isSystem: false,
    balance: 0,
    totalDebit: 0,
    totalCredit: 0,
  });
}
