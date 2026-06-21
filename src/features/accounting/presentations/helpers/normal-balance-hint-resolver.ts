import { NormalBalanceHintLine } from "@/features/accounting/domain/entities/normal-balance-hint";
import { AccountType } from "@/features/accounting/domain/enums/account-type";

export type NormalBalanceOutcome =
  | { kind: "deficit" }
  | { kind: "generic"; lines: NormalBalanceHintLine[] };

/**
 * Determines whether a set of NORMAL_BALANCE_HINT lines represents an accumulated-deficit
 * dead-end (equity account entered on the debit side) or a generic wrong-side correction.
 *
 * Rule: if ANY line is an equity account AND its `enteredSide` is "debit", the outcome
 * is "deficit". A mixed set (some deficit, some generic) resolves to "deficit".
 *
 * @param lines       Parsed hint lines from `parseNormalBalanceHintLines`.
 * @param accountTypeById  Lookup function supplied by the caller (e.g. built from
 *                         `useListLedgerAccounts()` entities: `id → entity.type`).
 */
export function resolveNormalBalanceOutcome(
  lines: NormalBalanceHintLine[],
  accountTypeById: (id: string) => AccountType | undefined,
): NormalBalanceOutcome {
  for (const line of lines) {
    const type = accountTypeById(line.accountId);
    if (type === AccountType.EQUITY && line.enteredSide === "debit") {
      return { kind: "deficit" };
    }
  }
  return { kind: "generic", lines };
}
