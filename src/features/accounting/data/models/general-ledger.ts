import { AbstractModel } from "@/core/resources/model";
import { TrialBalanceAccountType } from "@/features/accounting/domain/entities/trial-balance";
import {
  GeneralLedgerLineEntity,
  GeneralLedgerCounterpartEntity,
  GeneralLedgerSummaryEntity,
  GeneralLedgerReportEntity,
  GeneralLedgerReportMeta,
} from "@/features/accounting/domain/entities/general-ledger";

export class GeneralLedgerLineModel implements AbstractModel {
  constructor(
    public readonly id: string,
    public readonly journalEntryId: string,
    public readonly date: string,
    public readonly memo: string | null,
    public readonly referenceType: string | null,
    public readonly referenceId: string | null,
    public readonly referenceLabel: string | null,
    public readonly accountCode: string,
    public readonly accountName: string,
    public readonly debit: number,
    public readonly credit: number,
    public readonly runningBalance: number,
    public readonly entryType: "standard" | "opening_balance" | "closing",
    public readonly postedByKind: "user" | "system",
    public readonly postedByLabel: string,
  ) {}

  public static fromJson(raw: Record<string, any>): GeneralLedgerLineModel {
    return new GeneralLedgerLineModel(
      raw["id"] ?? "",
      raw["journal_entry_id"] ?? "",
      raw["date"] ?? "",
      raw["memo"] ?? null,
      raw["reference_type"] ?? null,
      raw["reference_id"] ?? null,
      raw["reference_label"] ?? null,
      raw["account_code"] ?? "",
      raw["account_name"] ?? "",
      raw["debit"] ?? 0,
      raw["credit"] ?? 0,
      raw["running_balance"] ?? 0,
      (raw["entry_type"] ?? "standard") as "standard" | "opening_balance" | "closing",
      (raw["posted_by"]?.["kind"] ?? "system") as "user" | "system",
      raw["posted_by"]?.["label"] ?? "",
    );
  }

  public toEntity(): GeneralLedgerLineEntity {
    return new GeneralLedgerLineEntity(
      this.id,
      this.journalEntryId,
      this.date,
      this.memo,
      this.referenceType,
      this.referenceId,
      this.referenceLabel,
      this.accountCode,
      this.accountName,
      this.debit,
      this.credit,
      this.runningBalance,
      this.entryType,
      this.postedByKind,
      this.postedByLabel,
    );
  }
}

export class GeneralLedgerCounterpartModel implements AbstractModel {
  constructor(
    public readonly id: string,
    public readonly journalEntryId: string,
    public readonly accountCode: string,
    public readonly accountName: string,
    public readonly debit: number,
    public readonly credit: number,
  ) {}

  public static fromJson(raw: Record<string, any>): GeneralLedgerCounterpartModel {
    return new GeneralLedgerCounterpartModel(
      raw["id"] ?? "",
      raw["journal_entry_id"] ?? "",
      raw["account_code"] ?? "",
      raw["account_name"] ?? "",
      raw["debit"] ?? 0,
      raw["credit"] ?? 0,
    );
  }

  public toEntity(): GeneralLedgerCounterpartEntity {
    return new GeneralLedgerCounterpartEntity(
      this.id,
      this.journalEntryId,
      this.accountCode,
      this.accountName,
      this.debit,
      this.credit,
    );
  }
}

export class GeneralLedgerSummaryModel implements AbstractModel {
  constructor(
    public readonly openingDebit: number,
    public readonly openingCredit: number,
    public readonly openingBalance: number,
    public readonly periodDebitTotal: number,
    public readonly periodCreditTotal: number,
    public readonly closingDebit: number,
    public readonly closingCredit: number,
    public readonly closingBalance: number,
    public readonly naturalSide: "debit" | "credit",
  ) {}

  public static fromJson(raw: Record<string, any>): GeneralLedgerSummaryModel {
    return new GeneralLedgerSummaryModel(
      raw["opening_debit"] ?? 0,
      raw["opening_credit"] ?? 0,
      raw["opening_balance"] ?? 0,
      raw["period_debit_total"] ?? 0,
      raw["period_credit_total"] ?? 0,
      raw["closing_debit"] ?? 0,
      raw["closing_credit"] ?? 0,
      raw["closing_balance"] ?? 0,
      (raw["natural_side"] ?? "debit") as "debit" | "credit",
    );
  }

  public toEntity(): GeneralLedgerSummaryEntity {
    return new GeneralLedgerSummaryEntity(
      this.openingDebit,
      this.openingCredit,
      this.openingBalance,
      this.periodDebitTotal,
      this.periodCreditTotal,
      this.closingDebit,
      this.closingCredit,
      this.closingBalance,
      this.naturalSide,
    );
  }
}

export class GeneralLedgerReportModel implements AbstractModel {
  constructor(
    public readonly metaAccountId: string,
    public readonly metaAccountCode: string,
    public readonly metaAccountName: string,
    public readonly metaAccountType: TrialBalanceAccountType,
    public readonly metaFrom: string,
    public readonly metaTo: string,
    public readonly metaTruncated: boolean,
    public readonly metaLineCap: number,
    public readonly summary: GeneralLedgerSummaryModel,
    public readonly lines: GeneralLedgerLineModel[],
    public readonly counterparts: GeneralLedgerCounterpartModel[],
  ) {}

  public static fromJson(raw: Record<string, any>): GeneralLedgerReportModel {
    const lines = (raw["lines"] ?? []).map(GeneralLedgerLineModel.fromJson);
    const counterparts = (raw["counterparts"] ?? []).map(GeneralLedgerCounterpartModel.fromJson);
    const summary = GeneralLedgerSummaryModel.fromJson(raw["summary"] ?? {});
    return new GeneralLedgerReportModel(
      raw["meta"]?.["account_id"] ?? "",
      raw["meta"]?.["account_code"] ?? "",
      raw["meta"]?.["account_name"] ?? "",
      (raw["meta"]?.["account_type"] ?? "asset") as TrialBalanceAccountType,
      raw["meta"]?.["from"] ?? "",
      raw["meta"]?.["to"] ?? "",
      raw["meta"]?.["truncated"] ?? false,
      raw["meta"]?.["line_cap"] ?? 0,
      summary,
      lines,
      counterparts,
    );
  }

  public toEntity(): GeneralLedgerReportEntity {
    const meta: GeneralLedgerReportMeta = {
      accountId: this.metaAccountId,
      accountCode: this.metaAccountCode,
      accountName: this.metaAccountName,
      accountType: this.metaAccountType,
      from: this.metaFrom,
      to: this.metaTo,
      truncated: this.metaTruncated,
      lineCap: this.metaLineCap,
    };
    return new GeneralLedgerReportEntity(
      meta,
      this.summary.toEntity(),
      this.lines.map((l) => l.toEntity()),
      this.counterparts.map((c) => c.toEntity()),
    );
  }
}
