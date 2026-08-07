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
    public readonly firstPostingDate: string | null,
    public readonly lastPostingDate: string | null,
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
    return new CostValuationGapRowModel(
      resolveGapKind(raw["gap_kind"]),
      raw["subject_id"] ?? "",
      raw["name"] || null,
      raw["variant_name"] || null,
      raw["unit"] || null,
      raw["deleted"] ?? false,
      raw["occurrence_count"] ?? 0,
      raw["affected_sale_count"] ?? 0,
      raw["unvalued_qty"] ?? 0,
      raw["first_posting_date"] || null,
      raw["last_posting_date"] || null,
      raw["hpp_omitted_count"] ?? null,
      raw["hpp_understated_count"] ?? null,
      resolveCause(raw["cause"]),
      raw["action_required"] ?? false,
      raw["action_text"] ?? "",
      buildCorrectingEntry(raw["correcting_entry"]),
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

const KNOWN_GAP_KINDS: ReadonlySet<string> = new Set(["variant", "raw_material"]);
const KNOWN_CAUSES: ReadonlySet<string> = new Set(["no_source_record", "cost_basis_not_derived"]);

/**
 * Resolve a gap_kind from the raw API value, warning on unknown enum members so
 * backend contract drift is visible in dev without crashing production.
 */
function resolveGapKind(raw: unknown): CostValuationGapKind {
  if (typeof raw === "string" && KNOWN_GAP_KINDS.has(raw)) return raw as CostValuationGapKind;
  if (typeof raw === "string" && raw !== "" && process.env.NODE_ENV !== "production") {
    console.warn(`[CostValuationGap] Unknown gap_kind "${raw}" from API — falling back to "variant".`);
  }
  return "variant";
}

/**
 * Resolve a cause from the raw API value, warning on unknown enum members so
 * backend contract drift is visible in dev without crashing production.
 */
function resolveCause(raw: unknown): CostValuationGapCause {
  if (typeof raw === "string" && KNOWN_CAUSES.has(raw)) return raw as CostValuationGapCause;
  if (typeof raw === "string" && raw !== "" && process.env.NODE_ENV !== "production") {
    console.warn(`[CostValuationGap] Unknown cause "${raw}" from API — falling back to "no_source_record".`);
  }
  return "no_source_record";
}

/**
 * Build a CorrectingEntryModel only when the raw object has both a debit and a
 * credit with a non-empty code. A present-but-empty correcting_entry would
 * otherwise render a bogus "HPP · Persediaan" label with empty codes — treat it
 * as unmapped (null) instead.
 */
function buildCorrectingEntry(raw: Record<string, any> | null | undefined): CorrectingEntryModel | null {
  if (!raw) return null;
  const debitCode = raw["debit"]?.["code"];
  const creditCode = raw["credit"]?.["code"];
  if (!debitCode || !creditCode) return null;
  return CorrectingEntryModel.fromJson(raw);
}