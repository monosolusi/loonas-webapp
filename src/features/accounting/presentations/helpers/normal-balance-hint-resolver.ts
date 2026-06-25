import { NormalBalanceHintLine } from "@/features/accounting/domain/entities/normal-balance-hint";
import { AccountType } from "@/features/accounting/domain/enums/account-type";

export type NormalBalanceOutcome =
  | { kind: "deficit" }
  | { kind: "generic"; lines: NormalBalanceHintLine[] };

/**
 * Determines whether a set of NORMAL_BALANCE_HINT lines represents actionable
 * wrong-side corrections ("generic") or an accumulated-deficit dead-end ("deficit").
 *
 * Resolution order (fixable lines lead):
 *   1. Partition lines into fixable (wrong-side, NOT equity-on-debit) and deficit
 *      (equity account with `enteredSide === "debit"`).
 *   2. If ANY fixable lines exist → return `{kind:"generic", lines: fixableLines}`.
 *      Only the fixable lines are returned so the owner sees actionable corrections;
 *      the deficit line is excluded from the generic block.
 *   3. Else if a deficit line exists → return `{kind:"deficit"}` (dead-end).
 *   4. Else → `{kind:"generic", lines}` (defensive: no deficit, pass all lines).
 *
 * This replaces the prior "first equity-on-debit wins" logic. A mixed 422 payload
 * (some fixable, some deficit) now resolves to generic so the owner can correct the
 * fixable entries; the deficit path is only reached when every hint line is a deficit.
 *
 * @param lines            Parsed hint lines from `parseNormalBalanceHintLines`.
 * @param accountTypeById  Lookup supplied by the caller (`id → entity.type`).
 */
export function resolveNormalBalanceOutcome(
  lines: NormalBalanceHintLine[],
  accountTypeById: (id: string) => AccountType | undefined,
): NormalBalanceOutcome {
  const genericLines: NormalBalanceHintLine[] = [];
  let hasDeficit = false;

  for (const line of lines) {
    const type = accountTypeById(line.accountId);
    if (type === AccountType.EQUITY && line.enteredSide === "debit") {
      hasDeficit = true;
    } else {
      genericLines.push(line);
    }
  }

  if (genericLines.length > 0) {
    return { kind: "generic", lines: genericLines };
  }
  if (hasDeficit) {
    return { kind: "deficit" };
  }
  // Defensive: no deficit flag, no generic lines (empty input or all unknown types)
  return { kind: "generic", lines };
}
