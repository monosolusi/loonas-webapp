import { AbstractModel } from "@/core/resources/model";
import {
  AccountRefEntity,
  CorrectingEntryEntity,
  CostValuationGapCause,
  CostValuationGapKind,
  CostValuationGapRowEntity,
} from "@/features/accounting/domain/entities/cost-valuation-gap";

export class AccountRefModel implements AbstractModel {
  constructor(
    public readonly code: string,
    public readonly name: string,
  ) {}

  public static fromJson(raw: Record<string, any>): AccountRefModel {
    return new AccountRefModel(raw["code"] ?? "", raw["name"] ?? "");
  }

  public toEntity(): AccountRefEntity {
    return new AccountRefEntity(this.code, this.name);
  }
}

export class CorrectingEntryModel implements AbstractModel {
  constructor(
    public readonly debit: AccountRefModel,
    public readonly credit: AccountRefModel,
  ) {}

  public static fromJson(raw: Record<string, any>): CorrectingEntryModel {
    return new CorrectingEntryModel(
      AccountRefModel.fromJson(raw["debit"] ?? {}),
      AccountRefModel.fromJson(raw["credit"] ?? {}),
    );
  }

  public toEntity(): CorrectingEntryEntity {
    return new CorrectingEntryEntity(this.debit.toEntity(), this.credit.toEntity());
  }
}

export class CostValuationGapRowModel implements AbstractModel {
  constructor(
    public readonly gapKind: CostValuationGapKind,
    public readonly subjectId: string,
    public readonly name: string | null,
    public readonly variantName: string | null,
    public readonly unit: string | null,
    public readonly deleted: boolean,
    public readonly occurrenceCount: number,
    public readonly affectedSaleCount: number,
    public readonly unvaluedQty: number,
    public readonly firstPostingDate: string,
    public readonly lastPostingDate: string,
    public readonly hppOmittedCount: number | null,
    public readonly hppUnderstatedCount: number | null,
    public readonly cause: CostValuationGapCause,
    public readonly actionRequired: boolean,
    public readonly actionText: string,
    public readonly correctingEntry: CorrectingEntryModel | null,
    public readonly currentWac: number | null,
    public readonly correctingAmount: number | null,
  ) {}

  public static fromJson(raw: Record<string, any>): CostValuationGapRowModel {
    const correctingRaw = raw["correcting_entry"];
    return new CostValuationGapRowModel(
      raw["gap_kind"] ?? "variant",
      raw["subject_id"] ?? "",
      raw["name"] ?? null,
      raw["variant_name"] ?? null,
      raw["unit"] ?? null,
      raw["deleted"] ?? false,
      raw["occurrence_count"] ?? 0,
      raw["affected_sale_count"] ?? 0,
      raw["unvalued_qty"] ?? 0,
      raw["first_posting_date"] ?? "",
      raw["last_posting_date"] ?? "",
      raw["hpp_omitted_count"] ?? null,
      raw["hpp_understated_count"] ?? null,
      raw["cause"] ?? "no_source_record",
      raw["action_required"] ?? false,
      raw["action_text"] ?? "",
      correctingRaw ? CorrectingEntryModel.fromJson(correctingRaw) : null,
      raw["current_wac"] ?? null,
      raw["correcting_amount"] ?? null,
    );
  }

  public toEntity(): CostValuationGapRowEntity {
    return new CostValuationGapRowEntity(
      this.gapKind,
      this.subjectId,
      this.name,
      this.variantName,
      this.unit,
      this.deleted,
      this.occurrenceCount,
      this.affectedSaleCount,
      this.unvaluedQty,
      this.firstPostingDate,
      this.lastPostingDate,
      this.hppOmittedCount,
      this.hppUnderstatedCount,
      this.cause,
      this.actionRequired,
      this.actionText,
      this.correctingEntry?.toEntity() ?? null,
      this.currentWac,
      this.correctingAmount,
    );
  }
}