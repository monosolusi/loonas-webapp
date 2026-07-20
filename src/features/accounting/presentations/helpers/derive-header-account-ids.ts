import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";

/**
 * Derives the set of "header account" IDs from a full account list.
 * A header account is one whose `id` appears as some other account's `parentId`.
 * After the LedgerAccountModel.fromJson parentId drift fix, child accounts carry a non-null parentId.
 */
export function deriveHeaderAccountIds(accounts: LedgerAccountEntity[]): Set<string> {
  const headerIds = new Set<string>();
  for (const account of accounts) {
    if (account.parentId !== null) {
      headerIds.add(account.parentId);
    }
  }
  return headerIds;
}
