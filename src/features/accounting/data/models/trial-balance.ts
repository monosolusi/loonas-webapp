import { AbstractModel } from "@/core/resources/model";
import {
  TrialBalanceAccountType,
  TrialBalanceGroupType,
  TrialBalanceRowEntity,
  TrialBalanceGroupEntity,
  TrialBalanceReportEntity,
} from "@/features/accounting/domain/entities/trial-balance";

export class TrialBalanceRowModel implements AbstractModel {
  constructor(
    public readonly id: string,
    public readonly accountCode: string,
    public readonly accountName: string,
    public readonly accountType: TrialBalanceAccountType,
    public readonly naturalSide: "debit" | "credit",
    public readonly openingDebit: number,
    public readonly openingCredit: number,
    public readonly periodDebit: number,
    public readonly periodCredit: number,
    public readonly closingDebit: number,
    public readonly closingCredit: number,
    public readonly isAbnormalBalance: boolean,
    public readonly displayOrder: number,
  ) {}

  public static fromJson(raw: Record<string, any>, index: number): TrialBalanceRowModel {
    return new TrialBalanceRowModel(
      `${raw["account_code"] ?? "row"}-${index}`,
      raw["account_code"] ?? "",
      raw["account_name"] ?? "",
      (raw["account_type"] ?? "asset") as TrialBalanceAccountType,
      (raw["natural_side"] ?? "debit") as "debit" | "credit",
      raw["opening_debit"] ?? 0,
      raw["opening_credit"] ?? 0,
      raw["period_debit"] ?? 0,
      raw["period_credit"] ?? 0,
      raw["closing_debit"] ?? 0,
      raw["closing_credit"] ?? 0,
      raw["is_abnormal_balance"] ?? false,
      raw["display_order"] ?? index,
    );
  }

  public toEntity(): TrialBalanceRowEntity {
    return new TrialBalanceRowEntity(
      this.id,
      this.accountCode,
      this.accountName,
      this.accountType,
      this.naturalSide,
      this.openingDebit,
      this.openingCredit,
      this.periodDebit,
      this.periodCredit,
      this.closingDebit,
      this.closingCredit,
      this.isAbnormalBalance,
      this.displayOrder,
    );
  }
}

export class TrialBalanceGroupModel implements AbstractModel {
  constructor(
    public readonly id: TrialBalanceGroupType,
    public readonly group: TrialBalanceGroupType,
    public readonly label: string,
    public readonly displayOrder: number,
    public readonly accounts: TrialBalanceRowModel[],
    public readonly subtotalDebit: number,
    public readonly subtotalCredit: number,
    public readonly netPosition: number,
  ) {}

  public static fromJson(raw: Record<string, any>): TrialBalanceGroupModel {
    const accounts = (raw["accounts"] ?? []).map((item: Record<string, any>, idx: number) =>
      TrialBalanceRowModel.fromJson(item, idx),
    );
    return new TrialBalanceGroupModel(
      (raw["group"] ?? "asset") as TrialBalanceGroupType,
      (raw["group"] ?? "asset") as TrialBalanceGroupType,
      raw["label"] ?? "",
      raw["display_order"] ?? 0,
      accounts,
      raw["group_subtotal"]?.["debit_total"] ?? 0,
      raw["group_subtotal"]?.["credit_total"] ?? 0,
      raw["group_subtotal"]?.["net_position"] ?? 0,
    );
  }

  public toEntity(): TrialBalanceGroupEntity {
    const sortedAccounts = this.accounts
      .map((a) => a.toEntity())
      .sort((a, b) => a.displayOrder - b.displayOrder);
    return new TrialBalanceGroupEntity(
      this.id,
      this.group,
      this.label,
      this.displayOrder,
      sortedAccounts,
      this.subtotalDebit,
      this.subtotalCredit,
      this.netPosition,
    );
  }
}

export class TrialBalanceReportModel implements AbstractModel {
  constructor(
    public readonly asOf: string,
    public readonly fiscalYearStart: string,
    public readonly includeZero: boolean,
    public readonly groups: TrialBalanceGroupModel[],
    public readonly openingDebitTotal: number,
    public readonly openingCreditTotal: number,
    public readonly periodDebitTotal: number,
    public readonly periodCreditTotal: number,
    public readonly closingDebitTotal: number,
    public readonly closingCreditTotal: number,
    public readonly isBalanced: boolean,
    public readonly imbalanceDelta: number,
  ) {}

  public static fromJson(raw: Record<string, any>): TrialBalanceReportModel {
    const groups = (raw["groups"] ?? []).map(TrialBalanceGroupModel.fromJson);
    return new TrialBalanceReportModel(
      raw["meta"]?.["as_of_date"] ?? "",
      raw["meta"]?.["fiscal_year_start"] ?? "",
      raw["meta"]?.["include_zero"] ?? false,
      groups,
      raw["totals"]?.["opening_debit_total"] ?? 0,
      raw["totals"]?.["opening_credit_total"] ?? 0,
      raw["totals"]?.["period_debit_total"] ?? 0,
      raw["totals"]?.["period_credit_total"] ?? 0,
      raw["totals"]?.["closing_debit_total"] ?? 0,
      raw["totals"]?.["closing_credit_total"] ?? 0,
      raw["_imbalance"]?.["is_balanced"] ?? true,
      raw["_imbalance"]?.["delta"] ?? 0,
    );
  }

  public toEntity(): TrialBalanceReportEntity {
    const sortedGroups = this.groups
      .map((g) => g.toEntity())
      .sort((a, b) => a.displayOrder - b.displayOrder);
    return new TrialBalanceReportEntity(
      this.asOf,
      this.fiscalYearStart,
      this.includeZero,
      sortedGroups,
      this.openingDebitTotal,
      this.openingCreditTotal,
      this.periodDebitTotal,
      this.periodCreditTotal,
      this.closingDebitTotal,
      this.closingCreditTotal,
      this.isBalanced,
      this.imbalanceDelta,
    );
  }
}
