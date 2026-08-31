import { AbstractEntity } from "@/core/resources/entity";

type BalanceEntityConstructor = {
  balance: number;
  currency: string;
};

export class BalanceEntity implements AbstractEntity {
  public readonly balance: number;
  public readonly currency: string;

  constructor(args: BalanceEntityConstructor) {
    this.balance = args.balance;
    this.currency = args.currency;
  }
}
