import { AbstractEntity } from "@/core/resources/entity";

export type BalanceSide = "debit" | "credit";

export class NormalBalanceHintLine implements AbstractEntity {
  public readonly accountId: string;
  public readonly enteredSide: BalanceSide;
  public readonly correctedSide: BalanceSide;

  constructor(accountId: string, enteredSide: BalanceSide, correctedSide: BalanceSide) {
    this.accountId = accountId;
    this.enteredSide = enteredSide;
    this.correctedSide = correctedSide;
  }
}
