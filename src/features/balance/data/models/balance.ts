import { AbstractModel } from "@/core/resources/model";
import { BalanceEntity } from "@/features/balance/domain/entities/balance";

type BalanceModelConstructor = {
  balance: number;
  currency: string;
};

export class BalanceModel implements AbstractModel {
  public readonly balance: number;
  public readonly currency: string;

  constructor(args: BalanceModelConstructor) {
    this.balance = args.balance;
    this.currency = args.currency;
  }

  public static fromJson(data: Record<string, any>): BalanceModel {
    return new BalanceModel({
      balance: data["balance"] ?? 0,
      currency: data["currency"] ?? "",
    });
  }

  public toEntity(): BalanceEntity {
    return new BalanceEntity({
      balance: this.balance,
      currency: this.currency,
    });
  }
}
