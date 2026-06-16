import { AbstractEntity } from "@/core/resources/entity";

export type TrialBalanceAccountType =
  | "asset"
  | "contra_asset"
  | "liability"
  | "equity"
  | "contra_equity"
  | "revenue"
  | "contra_revenue"
  | "expense"
  | "contra_expense"
  | "cogs";

export type TrialBalanceGroupType = "asset" | "liability" | "equity" | "revenue" | "expense";

export class TrialBalanceRowEntity implements AbstractEntity {
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
}

export class TrialBalanceGroupEntity implements AbstractEntity {
  constructor(
    public readonly id: TrialBalanceGroupType,
    public readonly group: TrialBalanceGroupType,
    public readonly label: string,
    public readonly displayOrder: number,
    public readonly accounts: TrialBalanceRowEntity[],
    public readonly subtotalDebit: number,
    public readonly subtotalCredit: number,
    public readonly netPosition: number,
  ) {}
}

export class TrialBalanceReportEntity implements AbstractEntity {
  constructor(
    public readonly asOf: string,
    public readonly fiscalYearStart: string,
    public readonly includeZero: boolean,
    public readonly groups: TrialBalanceGroupEntity[],
    public readonly openingDebitTotal: number,
    public readonly openingCreditTotal: number,
    public readonly periodDebitTotal: number,
    public readonly periodCreditTotal: number,
    public readonly closingDebitTotal: number,
    public readonly closingCreditTotal: number,
    public readonly isBalanced: boolean,
    public readonly imbalanceDelta: number,
  ) {}
}
