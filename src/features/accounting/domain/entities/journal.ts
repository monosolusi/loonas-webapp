import { AbstractEntity } from "@/core/resources/entity";
import { DateTime } from "luxon";
import { JournalLineEntity } from "@/features/accounting/domain/entities/journal-line";

export type JournalPostedBy = {
  kind: "user" | "system";
  label: string;
};

type JournalEntityConstructor = {
  id: string;
  date: string;
  memo: string;
  referenceType: string | null;
  referenceId: string | null;
  lines: JournalLineEntity[];
  createdAt: string;
  postedBy: JournalPostedBy | null;
  isReversal: boolean;
  reversedJournalId: string | null;
  supersededById: string | null;
  isReversedCurrently: boolean;
};

export class JournalEntity implements AbstractEntity {
  public id: string;
  public date: string;
  public memo: string;
  public referenceType: string | null;
  public referenceId: string | null;
  public lines: JournalLineEntity[];
  public createdAt: string;
  public readonly postedBy: JournalPostedBy | null;
  public readonly isReversal: boolean;
  public readonly reversedJournalId: string | null;
  public readonly supersededById: string | null;
  public readonly isReversedCurrently: boolean;

  constructor(args: JournalEntityConstructor) {
    this.id = args.id;
    this.date = args.date;
    this.memo = args.memo;
    this.referenceType = args.referenceType;
    this.referenceId = args.referenceId;
    this.lines = args.lines;
    this.createdAt = args.createdAt;
    this.postedBy = args.postedBy;
    this.isReversal = args.isReversal;
    this.reversedJournalId = args.reversedJournalId;
    this.supersededById = args.supersededById;
    this.isReversedCurrently = args.isReversedCurrently;
  }

  public get totalDebit(): number {
    return this.lines.reduce((sum, line) => sum + line.debit, 0);
  }

  public get totalCredit(): number {
    return this.lines.reduce((sum, line) => sum + line.credit, 0);
  }

  public get displayDate(): string {
    return DateTime.fromISO(this.date).setLocale("id").toFormat("dd MMM yyyy");
  }
}
