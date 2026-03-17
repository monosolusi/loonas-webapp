import { AbstractEntity } from "@/core/resources/entity";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { DateTime } from "luxon";

type LedgerEntryEntityConstructor = {
  id: string;
  accountId: string;
  accountCode: string;
  accountName: string;
  debit: number;
  credit: number;
  date: string;
  memo: string;
};

export class LedgerEntryEntity implements AbstractEntity {
  public id: string;
  public accountId: string;
  public accountCode: string;
  public accountName: string;
  public debit: number;
  public credit: number;
  public date: string;
  public memo: string;

  constructor(args: LedgerEntryEntityConstructor) {
    this.id = args.id;
    this.accountId = args.accountId;
    this.accountCode = args.accountCode;
    this.accountName = args.accountName;
    this.debit = args.debit;
    this.credit = args.credit;
    this.date = args.date;
    this.memo = args.memo;
  }

  public get displayDebit(): string {
    return this.debit > 0 ? IDRFormatter.toCurrency(this.debit) : "—";
  }

  public get displayCredit(): string {
    return this.credit > 0 ? IDRFormatter.toCurrency(this.credit) : "—";
  }

  public get displayDate(): string {
    return DateTime.fromISO(this.date).setLocale("id").toFormat("dd MMM yyyy");
  }
}
