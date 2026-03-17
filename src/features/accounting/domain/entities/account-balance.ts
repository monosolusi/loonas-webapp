import { AbstractEntity } from "@/core/resources/entity";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";

type AccountBalanceEntityConstructor = {
  accountId: string;
  totalDebit: number;
  totalCredit: number;
  balance: number;
};

export class AccountBalanceEntity implements AbstractEntity {
  public id: string;
  public accountId: string;
  public totalDebit: number;
  public totalCredit: number;
  public balance: number;

  constructor(args: AccountBalanceEntityConstructor) {
    this.id = args.accountId;
    this.accountId = args.accountId;
    this.totalDebit = args.totalDebit;
    this.totalCredit = args.totalCredit;
    this.balance = args.balance;
  }

  public get displayBalance(): string {
    return IDRFormatter.toCurrency(this.balance);
  }

  public get displayDebit(): string {
    return IDRFormatter.toCurrency(this.totalDebit);
  }

  public get displayCredit(): string {
    return IDRFormatter.toCurrency(this.totalCredit);
  }
}
