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
  public readonly id: string;
  public readonly code: string;
  public readonly name: string;
  public readonly type: AccountType;
  public readonly parentId: string | null;
  public readonly isSystem: boolean;
  public readonly balance: number;
  public readonly totalDebit: number;
  public readonly totalCredit: number;

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
