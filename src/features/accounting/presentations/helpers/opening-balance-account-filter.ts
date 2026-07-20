import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { AccountType } from "@/features/accounting/domain/enums/account-type";

// Account types that belong on the balance sheet and are permitted in the opening balance wizard.
const BALANCE_SHEET_TYPES = new Set<AccountType>([
  AccountType.ASSET,
  AccountType.CONTRA_ASSET,
  AccountType.LIABILITY,
  AccountType.EQUITY,
  AccountType.CONTRA_EQUITY,
]);

// Account codes explicitly excluded from user input (auto-computed by the wizard).
const EXCLUDED_CODES = new Set(["3200", "3300"]);

/**
 * Returns true when a ledger account may appear as a user-input row in the opening balance wizard.
 * Excludes: income-statement types, header accounts (those in headerIds), and auto-computed codes (3200, 3300).
 */
export function isPermittedOpeningBalanceAccount(
  account: LedgerAccountEntity,
  headerIds: Set<string>,
): boolean {
  if (!BALANCE_SHEET_TYPES.has(account.type)) return false;
  if (headerIds.has(account.id)) return false;
  if (EXCLUDED_CODES.has(account.code)) return false;
  return true;
}

const GROUP_TYPES: Record<"assets" | "liabilities" | "equity", Set<AccountType>> = {
  assets: new Set([AccountType.ASSET, AccountType.CONTRA_ASSET]),
  liabilities: new Set([AccountType.LIABILITY]),
  equity: new Set([AccountType.EQUITY, AccountType.CONTRA_EQUITY]),
};

export type BalanceGroup = "assets" | "liabilities" | "equity";

export function getAccountGroup(account: LedgerAccountEntity): BalanceGroup | null {
  for (const [group, types] of Object.entries(GROUP_TYPES) as [BalanceGroup, Set<AccountType>][]) {
    if (types.has(account.type)) return group;
  }
  return null;
}
