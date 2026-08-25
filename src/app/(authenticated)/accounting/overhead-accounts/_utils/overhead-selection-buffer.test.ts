import { describe, expect, it } from "vitest";
import { AccountType } from "@/features/accounting/domain/enums/account-type";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import {
  addAccountToBuffer,
  isBufferDirty,
  isClearingAllAccounts,
  removeAccountFromBuffer,
} from "@/app/(authenticated)/accounting/overhead-accounts/_utils/overhead-selection-buffer";

function account(id: string, args: { code?: string; name?: string } = {}): LedgerAccountEntity {
  return new LedgerAccountEntity({
    id,
    code: args.code ?? `600${id}`,
    name: args.name ?? `Akun ${id}`,
    type: AccountType.EXPENSE,
    parentId: null,
    isSystem: false,
    balance: 0,
    totalDebit: 0,
    totalCredit: 0,
  });
}

describe("addAccountToBuffer", () => {
  it("appends a new account", () => {
    const buffer = addAccountToBuffer([account("a")], account("b"));
    expect(buffer.map((a) => a.id)).toEqual(["a", "b"]);
  });

  it("is a no-op when the account is already present", () => {
    const initial = [account("a"), account("b")];
    const buffer = addAccountToBuffer(initial, account("a"));
    expect(buffer).toBe(initial);
  });
});

describe("removeAccountFromBuffer", () => {
  it("removes the matching account", () => {
    const buffer = removeAccountFromBuffer([account("a"), account("b")], "a");
    expect(buffer.map((a) => a.id)).toEqual(["b"]);
  });

  it("is a no-op when the id is not present", () => {
    const buffer = removeAccountFromBuffer([account("a")], "z");
    expect(buffer.map((a) => a.id)).toEqual(["a"]);
  });
});

describe("isBufferDirty", () => {
  it("is false when the buffer and saved sets contain the same ids, regardless of order", () => {
    const buffer = [account("b"), account("a")];
    const saved = [account("a"), account("b")];
    expect(isBufferDirty(buffer, saved)).toBe(false);
  });

  it("is true when an account was added", () => {
    const buffer = [account("a"), account("b")];
    const saved = [account("a")];
    expect(isBufferDirty(buffer, saved)).toBe(true);
  });

  it("is true when an account was removed", () => {
    const buffer = [account("a")];
    const saved = [account("a"), account("b")];
    expect(isBufferDirty(buffer, saved)).toBe(true);
  });

  it("is false when both are empty", () => {
    expect(isBufferDirty([], [])).toBe(false);
  });
});

describe("isClearingAllAccounts", () => {
  it("is true only when a non-empty saved selection becomes an empty buffer", () => {
    expect(isClearingAllAccounts([], [account("a")])).toBe(true);
  });

  it("is false on first load — an empty saved selection stays empty", () => {
    expect(isClearingAllAccounts([], [])).toBe(false);
  });

  it("is false when the buffer still has accounts", () => {
    expect(isClearingAllAccounts([account("a")], [account("a"), account("b")])).toBe(false);
  });

  it("is false when saved was already empty and the buffer gains accounts", () => {
    expect(isClearingAllAccounts([account("a")], [])).toBe(false);
  });
});
