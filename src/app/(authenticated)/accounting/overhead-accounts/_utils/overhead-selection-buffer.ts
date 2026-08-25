import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";

/**
 * Pure add/remove/dirty-diff helpers for the local edit buffer on `/accounting/overhead-accounts`.
 * The buffer is a set of accounts (order doesn't carry meaning — the PUT is a full replace), so
 * dirty-diff compares id sets rather than array order/identity.
 */

export function addAccountToBuffer(
  buffer: LedgerAccountEntity[],
  account: LedgerAccountEntity,
): LedgerAccountEntity[] {
  if (buffer.some((a) => a.id === account.id)) return buffer;
  return [...buffer, account];
}

export function removeAccountFromBuffer(buffer: LedgerAccountEntity[], accountId: string): LedgerAccountEntity[] {
  return buffer.filter((a) => a.id !== accountId);
}

function toIdSet(accounts: LedgerAccountEntity[]): Set<string> {
  return new Set(accounts.map((a) => a.id));
}

function sameIdSet(a: Set<string>, b: Set<string>): boolean {
  if (a.size !== b.size) return false;
  for (const id of a) {
    if (!b.has(id)) return false;
  }
  return true;
}

export function isBufferDirty(buffer: LedgerAccountEntity[], saved: LedgerAccountEntity[]): boolean {
  return !sameIdSet(toIdSet(buffer), toIdSet(saved));
}

/** True only when a previously non-empty saved selection is being replaced by an empty buffer. */
export function isClearingAllAccounts(buffer: LedgerAccountEntity[], saved: LedgerAccountEntity[]): boolean {
  return saved.length > 0 && buffer.length === 0;
}
