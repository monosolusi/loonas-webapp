import { AbstractModel } from "@/core/resources/model";
import { BalanceSide, NormalBalanceHintLine } from "@/features/accounting/domain/entities/normal-balance-hint";

function isBalanceSide(value: unknown): value is BalanceSide {
  return value === "debit" || value === "credit";
}

export class NormalBalanceHintLineModel implements AbstractModel {
  constructor(
    public readonly accountId: string,
    public readonly enteredSide: BalanceSide,
    public readonly correctedSide: BalanceSide,
  ) {}

  public static fromJson(data: Record<string, any>): NormalBalanceHintLineModel | null {
    const accountId = data["account_id"];
    const enteredSide = data["entered_side"];
    const correctedSide = data["corrected_side"];

    if (typeof accountId !== "string" || !isBalanceSide(enteredSide) || !isBalanceSide(correctedSide)) {
      return null;
    }

    return new NormalBalanceHintLineModel(accountId, enteredSide, correctedSide);
  }

  public toEntity(): NormalBalanceHintLine {
    return new NormalBalanceHintLine(this.accountId, this.enteredSide, this.correctedSide);
  }
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
      const model = NormalBalanceHintLineModel.fromJson(item);
      if (model !== null) result.push(model.toEntity());
    }
  }
  return result;
}
