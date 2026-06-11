import { AbstractEntity } from "@/core/resources/entity";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";

type JournalLineEntityConstructor = {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
};

export class JournalLineEntity implements AbstractEntity {
  public id: string;
  public accountId: string;
  public accountCode: string;
  public accountName: string;
  public debit: number;
  public credit: number;

  constructor(args: JournalLineEntityConstructor) {
    this.id = args.id;
    this.accountId = args.accountId;
    this.accountCode = args.accountCode;
    this.accountName = args.accountName;
    this.debit = args.debit;
    this.credit = args.credit;
  }

  public get displayDebit(): string {
    return this.debit > 0 ? IDRFormatter.toCurrency(this.debit) : "—";
  }

  public get displayCredit(): string {
    return this.credit > 0 ? IDRFormatter.toCurrency(this.credit) : "—";
  }
}
