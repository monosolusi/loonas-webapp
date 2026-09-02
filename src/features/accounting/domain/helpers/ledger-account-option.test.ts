import { describe, expect, it } from "vitest";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { AccountType } from "@/features/accounting/domain/enums/account-type";
import { toLedgerAccountOptionParts } from "@/features/accounting/domain/helpers/ledger-account-option";

function buildAccount(overrides: Partial<{ id: string; code: string; name: string; type: AccountType }>) {
  return new LedgerAccountEntity({
    id: overrides.id ?? "acc-1",
    code: overrides.code ?? "1100",
    name: overrides.name ?? "Kas dan Setara Kas",
    type: overrides.type ?? AccountType.ASSET,
    parentId: null,
    isSystem: false,
    balance: 0,
    totalDebit: 0,
    totalCredit: 0,
  });
}

describe("toLedgerAccountOptionParts", () => {
  // This is the explicit acceptance criterion (AC3): before the fix, `description` was the raw
  // `AccountType` enum value ("revenue"/"asset"/"expense"), not the Indonesian label. These three
  // assertions must fail against that old mapping.
  it("resolves description to the Indonesian account-type label, not the raw enum value", () => {
    expect(toLedgerAccountOptionParts(buildAccount({ type: AccountType.REVENUE })).description).toBe("Pendapatan");
    expect(toLedgerAccountOptionParts(buildAccount({ type: AccountType.ASSET })).description).toBe("Aset");
    expect(toLedgerAccountOptionParts(buildAccount({ type: AccountType.EXPENSE })).description).toBe("Beban");
  });

  it("builds label as `code — name` with an em dash, and id from the account id", () => {
    const parts = toLedgerAccountOptionParts(buildAccount({ id: "acc-42", code: "4100", name: "Pendapatan Jasa" }));
    expect(parts.label).toBe("4100 — Pendapatan Jasa");
    expect(parts.id).toBe("acc-42");
  });
});
