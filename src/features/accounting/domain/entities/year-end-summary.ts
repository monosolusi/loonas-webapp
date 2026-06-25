import { AbstractEntity } from "@/core/resources/entity";
import { AccountingPeriodEntity } from "@/features/accounting/domain/entities/accounting-period";

type YearEndSummaryEntityConstructor = {
  year: number;
  periods: AccountingPeriodEntity[];
  closeJournalId: string | null;
  closingJournalCreatedAt: string | null;
  locked: boolean;
};

export class YearEndSummaryEntity implements AbstractEntity {
  public readonly year: number;
  public readonly periods: AccountingPeriodEntity[];
  public readonly closeJournalId: string | null;
  public readonly closingJournalCreatedAt: string | null;
  public readonly locked: boolean;

  constructor(args: YearEndSummaryEntityConstructor) {
    this.year = args.year;
    this.periods = args.periods;
    this.closeJournalId = args.closeJournalId;
    this.closingJournalCreatedAt = args.closingJournalCreatedAt;
    this.locked = args.locked;
  }

  public get canUnlock(): boolean {
    return this.locked && this.closingJournalCreatedAt !== null;
  }
}
