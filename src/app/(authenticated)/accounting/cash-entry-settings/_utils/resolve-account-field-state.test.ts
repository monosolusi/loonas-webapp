import { describe, expect, it } from "vitest";
import { AccountType } from "@/features/accounting/domain/enums/account-type";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { resolveAccountFieldState } from "@/app/(authenticated)/accounting/cash-entry-settings/_utils/resolve-account-field-state";

describe("resolveAccountFieldState", () => {
  it("resolves an empty selection to no account, no notice and nothing to clear", () => {
    expect(resolveAccountFieldState({ kind: "empty" }, [account("acc-1")])).toEqual({
      account: null,
      missingSavedId: null,
      canClear: false,
    });
  });

  it("resolves a chosen account to the entity and a clear affordance", () => {
    const kas = account("acc-1");
    expect(resolveAccountFieldState({ kind: "account", accountId: "acc-1" }, [kas])).toEqual({
      account: kas,
      missingSavedId: null,
      canClear: true,
    });
  });

  it("resolves a missing saved id to no account, its own notice and a clear affordance", () => {
    expect(resolveAccountFieldState({ kind: "missing", savedId: "acc-gone" }, [account("acc-1")])).toEqual({
      account: null,
      missingSavedId: "acc-gone",
      canClear: true,
    });
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
