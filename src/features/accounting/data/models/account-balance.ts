import { AbstractModel } from "@/core/resources/model";
import { AccountBalanceEntity } from "@/features/accounting/domain/entities/account-balance";

export class AccountBalanceModel implements AbstractModel {
  constructor(
    public readonly accountId: string,
    public readonly totalDebit: number,
    public readonly totalCredit: number,
    public readonly balance: number,
  ) {}

  public static fromJson(data: Record<string, any>): AccountBalanceModel {
    return new AccountBalanceModel(
      data["account_id"],
      data["total_debit"] ?? 0,
      data["total_credit"] ?? 0,
      data["balance"] ?? 0,
    );
  }

  public toEntity(): AccountBalanceEntity {
    return new AccountBalanceEntity({
      accountId: this.accountId,
      totalDebit: this.totalDebit,
      totalCredit: this.totalCredit,
      balance: this.balance,
    });
  }
}
