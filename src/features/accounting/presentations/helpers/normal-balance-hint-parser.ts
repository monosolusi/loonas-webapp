import { BalanceSide, NormalBalanceHintLine } from "@/features/accounting/domain/entities/normal-balance-hint";

function isBalanceSide(value: unknown): value is BalanceSide {
  return value === "debit" || value === "credit";
}

/**
 * Parses the `lines` array from a NORMAL_BALANCE_HINT ServerError details payload.
 *
 * Nesting path (set by HttpRequest Task 1 fix):
 *   serverError.details.details.lines
 *
 * Example: parseNormalBalanceHintLines(serverError.details.details)
 *
 * Malformed entries (missing or invalid `entered_side`/`corrected_side`) are
 * silently dropped rather than coerced to a default value.
 */
export function parseNormalBalanceHintLines(details: Record<string, any> | undefined): NormalBalanceHintLine[] {
  if (!details) return [];
  const lines = details["lines"];
  if (!Array.isArray(lines)) return [];

  const result: NormalBalanceHintLine[] = [];
  for (const item of lines) {
    if (item && typeof item === "object") {
      const accountId = item["account_id"];
      const enteredSide = item["entered_side"];
      const correctedSide = item["corrected_side"];
      if (typeof accountId === "string" && isBalanceSide(enteredSide) && isBalanceSide(correctedSide)) {
        result.push(new NormalBalanceHintLine(accountId, enteredSide, correctedSide));
      }
    }
  }
  return result;
}
