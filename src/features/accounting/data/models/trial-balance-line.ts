import { AbstractModel } from "@/core/resources/model";
import { TrialBalanceLineEntity } from "@/features/accounting/domain/entities/trial-balance-line";

export class TrialBalanceLineModel implements AbstractModel {
  constructor(
    public readonly id: string,
    public readonly journalEntryId: string,
    public readonly date: string,
    public readonly memo: string | null,
    public readonly referenceType: string | null,
    public readonly referenceId: string | null,
    public readonly accountCode: string,
    public readonly accountName: string,
    public readonly debit: number,
    public readonly credit: number,
  ) {}

  public static fromJson(raw: Record<string, any>): TrialBalanceLineModel {
    return new TrialBalanceLineModel(
      raw["id"] ?? "",
      raw["journal_entry_id"] ?? "",
      raw["date"] ?? "",
      raw["memo"] ?? null,
      raw["reference_type"] ?? null,
      raw["reference_id"] ?? null,
      raw["account_code"] ?? "",
      raw["account_name"] ?? "",
      raw["debit"] ?? 0,
      raw["credit"] ?? 0,
    );
  }

  public toEntity(): TrialBalanceLineEntity {
    return new TrialBalanceLineEntity(
      this.id,
      this.journalEntryId,
      this.date,
      this.memo,
      this.referenceType,
      this.referenceId,
      this.accountCode,
      this.accountName,
      this.debit,
      this.credit,
    );
  }
}
