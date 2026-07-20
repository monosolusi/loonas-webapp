import { AbstractModel } from "@/core/resources/model";
import { AccountingPeriodModel } from "@/features/accounting/data/models/accounting-period";
import { YearEndSummaryEntity } from "@/features/accounting/domain/entities/year-end-summary";

export class YearEndSummaryModel implements AbstractModel {
  constructor(
    public readonly year: number,
    public readonly periods: AccountingPeriodModel[],
    public readonly closeJournalId: string | null,
    public readonly closingJournalCreatedAt: string | null,
    public readonly locked: boolean,
  ) {}

  public static fromJson(data: Record<string, any>): YearEndSummaryModel {
    return new YearEndSummaryModel(
      data["year"],
      (data["periods"] ?? []).map(AccountingPeriodModel.fromJson),
      data["close_journal_id"] ?? null,
      data["closing_journal_created_at"] ?? null,
      data["locked"] ?? false,
    );
  }

  public toEntity(): YearEndSummaryEntity {
    return new YearEndSummaryEntity({
      year: this.year,
      periods: this.periods.map((p) => p.toEntity()),
      closeJournalId: this.closeJournalId,
      closingJournalCreatedAt: this.closingJournalCreatedAt,
      locked: this.locked,
    });
  }
}
