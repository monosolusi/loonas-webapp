import { AbstractEntity } from "@/core/resources/entity";

export type CostValuationGapKind = "variant" | "raw_material";

export type CostValuationGapCause = "no_source_record" | "cost_basis_not_derived";

export class AccountRefEntity implements AbstractEntity {
  constructor(
    public readonly code: string,
    public readonly name: string,
  ) {}
}

export class CorrectingEntryEntity implements AbstractEntity {
  constructor(
    public readonly debit: AccountRefEntity,
    public readonly credit: AccountRefEntity,
  ) {}
}

export class CostValuationGapRowEntity implements AbstractEntity {
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
    public readonly correctingEntry: CorrectingEntryEntity | null,
    public readonly currentWac: number | null,
    public readonly correctingAmount: number | null,
  ) {}
}