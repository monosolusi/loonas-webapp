import { AbstractEntity } from "@/core/resources/entity";

export class CashFlowLineEntity implements AbstractEntity {
  constructor(
    public readonly label: string,
    public readonly rawBalanceDelta: number,
    public readonly cashImpactDelta: number,
    public readonly isAbnormalBalance: boolean,
  ) {}
}

export class CashFlowSubtotalEntity implements AbstractEntity {
  constructor(
    public readonly label: string,
    public readonly amount: number,
  ) {}
}

export class CashFlowOperatingSectionEntity implements AbstractEntity {
  constructor(
    public readonly label: string,
    public readonly netProfit: number,
    public readonly adjustments: CashFlowLineEntity[],
    public readonly workingCapitalChanges: CashFlowLineEntity[],
    public readonly subtotal: CashFlowSubtotalEntity,
  ) {}
}

export class CashFlowSectionEntity implements AbstractEntity {
  constructor(
    public readonly label: string,
    public readonly lines: CashFlowLineEntity[],
    public readonly subtotal: CashFlowSubtotalEntity,
  ) {}
}

export class CashFlowMetaEntity implements AbstractEntity {
  constructor(
    public readonly accountId: string,
    public readonly currency: string,
    public readonly periodFrom: string,
    public readonly periodTo: string,
    public readonly entityTypeUsedForLabels: "op" | "op_fallback" | "cv_firma" | "pt" | "koperasi",
    public readonly generatedAt: string,
    public readonly periodStatuses: { readonly period: string; readonly status: "open" | "closed" }[],
  ) {}
}

export class CashFlowReportEntity implements AbstractEntity {
  constructor(
    public readonly meta: CashFlowMetaEntity,
    public readonly operating: CashFlowOperatingSectionEntity,
    public readonly investing: CashFlowSectionEntity,
    public readonly financing: CashFlowSectionEntity,
    public readonly totalCashFlow: number,
    public readonly totalCashFlowLabel: string,
    public readonly openingCashBalance: number,
    public readonly openingCashBalanceLabel: string,
    public readonly closingCashBalance: number,
    public readonly closingCashBalanceLabel: string,
    public readonly nonCashTransactions: Record<string, any>[],
    public readonly isBalanced: boolean,
    public readonly imbalanceDelta: number,
  ) {}
}
