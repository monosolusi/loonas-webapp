import { AbstractEntity } from "@/core/resources/entity";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { AccountType } from "@/features/accounting/domain/enums/account-type";

type LedgerAccountEntityConstructor = {
  id: string;
  code: string;
  name: string;
  type: AccountType;
  parentId: string | null;
  isSystem: boolean;
  balance: number;
  totalDebit: number;
  totalCredit: number;
};

export class LedgerAccountEntity implements AbstractEntity {
  public id: string;
  public code: string;
  public name: string;
  public type: AccountType;
  public parentId: string | null;
  public isSystem: boolean;
  public balance: number;
  public totalDebit: number;
  public totalCredit: number;

  constructor(args: LedgerAccountEntityConstructor) {
    this.id = args.id;
    this.code = args.code;
    this.name = args.name;
    this.type = args.type;
    this.parentId = args.parentId;
    this.isSystem = args.isSystem;
    this.balance = args.balance;
    this.totalDebit = args.totalDebit;
    this.totalCredit = args.totalCredit;
  }

  public get displayBalance(): string {
    return IDRFormatter.toCurrency(this.balance);
  }
}
