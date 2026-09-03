import { describe, expect, it } from "vitest";
import { AccountType } from "@/features/accounting/domain/enums/account-type";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { resolveAccountEditField } from "@/app/(authenticated)/accounting/cash-categories/_utils/resolve-account-edit-field";

function buildAccount(id: string): LedgerAccountEntity {
  return new LedgerAccountEntity({
    id,
    code: "4200",
    name: "Pendapatan Lain-lain",
    type: AccountType.REVENUE,
    parentId: null,
    isSystem: false,
    balance: 0,
    totalDebit: 0,
    totalCredit: 0,
  });
}

describe("resolveAccountEditField", () => {
  it("is loading when the account list has not loaded yet, even with a known id", () => {
    const result = resolveAccountEditField("acc-1", null);
    expect(result).toEqual({ state: { kind: "loading" }, canSubmit: false });
  });

  it("is loading when there is no id to resolve yet", () => {
    const result = resolveAccountEditField(null, [buildAccount("acc-1")]);
    expect(result).toEqual({ state: { kind: "loading" }, canSubmit: false });
  });

  it("resolves to the matching account once the list has loaded and contains it", () => {
    const account = buildAccount("acc-1");
    const result = resolveAccountEditField("acc-1", [account]);
    expect(result.state).toEqual({ kind: "resolved", account });
    expect(result.canSubmit).toBe(true);
  });

  it("is missing — never empty or loading — when the list has loaded and the id is absent", () => {
    const result = resolveAccountEditField("acc-gone", [buildAccount("acc-1")]);
    expect(result).toEqual({ state: { kind: "missing", savedId: "acc-gone" }, canSubmit: false });
  });

  it("is missing (not loading) even against an empty but loaded list", () => {
    const result = resolveAccountEditField("acc-1", []);
    expect(result.state.kind).toBe("missing");
    expect(result.canSubmit).toBe(false);
  });

  it("is error — never loading — when the account list fetch failed", () => {
    const error = new ServerError(ErrorCodes.UNKNOWN);
    const result = resolveAccountEditField("acc-1", null, error);
    expect(result).toEqual({ state: { kind: "error", error }, canSubmit: false });
  });

  it("error outranks a known id resolving against a loaded list", () => {
    const error = new ServerError(ErrorCodes.UNKNOWN);
    const result = resolveAccountEditField("acc-1", [buildAccount("acc-1")], error);
    expect(result).toEqual({ state: { kind: "error", error }, canSubmit: false });
  });
});
