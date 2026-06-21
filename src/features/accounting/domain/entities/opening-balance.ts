import { AbstractEntity } from "@/core/resources/entity";

export type OpeningBalanceLineEntity = {
  readonly id: string;
  readonly accountId: string;
  readonly accountCode: string;
  readonly accountName: string;
  readonly debit: number;
  readonly credit: number;
};

type OpeningBalanceEntityConstructor = {
  id: string;
  date: string;
  memo: string;
  lines: OpeningBalanceLineEntity[];
  createdAt: string;
};

export class OpeningBalanceEntity implements AbstractEntity {
  public readonly id: string;
  public readonly date: string;
  public readonly memo: string;
  public readonly lines: OpeningBalanceLineEntity[];
  public readonly createdAt: string;

  constructor(args: OpeningBalanceEntityConstructor) {
    this.id = args.id;
    this.date = args.date;
    this.memo = args.memo;
    this.lines = args.lines;
    this.createdAt = args.createdAt;
  }
}
