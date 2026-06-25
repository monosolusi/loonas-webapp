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

