import { AbstractModel } from "@/core/resources/model";
import {
  CashFlowLineEntity,
  CashFlowSubtotalEntity,
  CashFlowOperatingSectionEntity,
  CashFlowSectionEntity,
  CashFlowMetaEntity,
  CashFlowReportEntity,
} from "@/features/accounting/domain/entities/cash-flow";

export class CashFlowLineModel implements AbstractModel {
  constructor(
    public readonly label: string,
    public readonly rawBalanceDelta: number,
    public readonly cashImpactDelta: number,
    public readonly isAbnormalBalance: boolean,
  ) {}

  public static fromJson(raw: Record<string, any>): CashFlowLineModel {
    return new CashFlowLineModel(
      raw["label"] ?? "",
      raw["raw_balance_delta"] ?? 0,
      raw["cash_impact_delta"] ?? 0,
      raw["is_abnormal_balance"] ?? false,
    );
  }

  public toEntity(): CashFlowLineEntity {
    return new CashFlowLineEntity(
      this.label,
      this.rawBalanceDelta,
      this.cashImpactDelta,
      this.isAbnormalBalance,
    );
  }
}

export class CashFlowSubtotalModel implements AbstractModel {
  constructor(
    public readonly label: string,
    public readonly amount: number,
  ) {}

  public static fromJson(raw: Record<string, any>): CashFlowSubtotalModel {
    return new CashFlowSubtotalModel(
      raw["label"] ?? "",
      raw["amount"] ?? 0,
    );
  }

  public toEntity(): CashFlowSubtotalEntity {
    return new CashFlowSubtotalEntity(this.label, this.amount);
  }
}

export class CashFlowOperatingSectionModel implements AbstractModel {
  constructor(
    public readonly label: string,
    public readonly netProfit: number,
    public readonly adjustments: CashFlowLineModel[],
    public readonly workingCapitalChanges: CashFlowLineModel[],
    public readonly subtotal: CashFlowSubtotalModel,
  ) {}

  public static fromJson(raw: Record<string, any>): CashFlowOperatingSectionModel {
    return new CashFlowOperatingSectionModel(
      raw["label"] ?? "",
      raw["net_profit"] ?? 0,
      (raw["adjustments"] ?? []).map(CashFlowLineModel.fromJson),
      (raw["working_capital_changes"] ?? []).map(CashFlowLineModel.fromJson),
      CashFlowSubtotalModel.fromJson(raw["subtotal"] ?? {}),
    );
  }

  public toEntity(): CashFlowOperatingSectionEntity {
    return new CashFlowOperatingSectionEntity(
      this.label,
      this.netProfit,
      this.adjustments.map((l) => l.toEntity()),
      this.workingCapitalChanges.map((l) => l.toEntity()),
      this.subtotal.toEntity(),
    );
  }
}

export class CashFlowSectionModel implements AbstractModel {
  constructor(
    public readonly label: string,
    public readonly lines: CashFlowLineModel[],
    public readonly subtotal: CashFlowSubtotalModel,
  ) {}

  public static fromJson(raw: Record<string, any>): CashFlowSectionModel {
    return new CashFlowSectionModel(
      raw["label"] ?? "",
      (raw["lines"] ?? []).map(CashFlowLineModel.fromJson),
      CashFlowSubtotalModel.fromJson(raw["subtotal"] ?? {}),
    );
  }

  public toEntity(): CashFlowSectionEntity {
    return new CashFlowSectionEntity(
      this.label,
      this.lines.map((l) => l.toEntity()),
      this.subtotal.toEntity(),
    );
  }
}

export class CashFlowMetaModel implements AbstractModel {
  constructor(
    public readonly accountId: string,
    public readonly currency: string,
    public readonly periodFrom: string,
    public readonly periodTo: string,
    public readonly entityTypeUsedForLabels: "op" | "op_fallback" | "cv_firma" | "pt" | "koperasi",
    public readonly generatedAt: string,
    public readonly periodStatuses: { readonly period: string; readonly status: "open" | "closed" }[],
  ) {}

  public static fromJson(raw: Record<string, any>): CashFlowMetaModel {
    return new CashFlowMetaModel(
      raw["account_id"] ?? "",
      raw["currency"] ?? "IDR",
      raw["period_from"] ?? "",
      raw["period_to"] ?? "",
      raw["entity_type_used_for_labels"] ?? "op",
      raw["generated_at"] ?? "",
      (raw["period_statuses"] ?? []).map((s: Record<string, any>) => ({
        period: s["period"] ?? "",
        status: s["status"] ?? "open",
      })),
    );
  }

  public toEntity(): CashFlowMetaEntity {
    return new CashFlowMetaEntity(
      this.accountId,
      this.currency,
      this.periodFrom,
      this.periodTo,
      this.entityTypeUsedForLabels,
      this.generatedAt,
      this.periodStatuses,
    );
  }
}

export class CashFlowModel implements AbstractModel {
  constructor(
    public readonly meta: CashFlowMetaModel,
    public readonly operating: CashFlowOperatingSectionModel,
    public readonly investing: CashFlowSectionModel,
    public readonly financing: CashFlowSectionModel,
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

  public static fromJson(raw: Record<string, any>): CashFlowModel {
    return new CashFlowModel(
      CashFlowMetaModel.fromJson(raw["meta"] ?? {}),
      CashFlowOperatingSectionModel.fromJson(raw["operating"] ?? {}),
      CashFlowSectionModel.fromJson(raw["investing"] ?? {}),
      CashFlowSectionModel.fromJson(raw["financing"] ?? {}),
      raw["total_cash_flow"] ?? 0,
      raw["total_cash_flow_label"] ?? "",
      raw["opening_cash_balance"] ?? 0,
      raw["opening_cash_balance_label"] ?? "",
      raw["closing_cash_balance"] ?? 0,
      raw["closing_cash_balance_label"] ?? "",
      raw["non_cash_transactions"] ?? [],
      raw["_imbalance"]?.["is_balanced"] ?? true,
      raw["_imbalance"]?.["delta"] ?? 0,
    );
  }

  public toEntity(): CashFlowReportEntity {
    return new CashFlowReportEntity(
      this.meta.toEntity(),
      this.operating.toEntity(),
      this.investing.toEntity(),
      this.financing.toEntity(),
      this.totalCashFlow,
      this.totalCashFlowLabel,
      this.openingCashBalance,
      this.openingCashBalanceLabel,
      this.closingCashBalance,
      this.closingCashBalanceLabel,
      this.nonCashTransactions,
      this.isBalanced,
      this.imbalanceDelta,
    );
  }
}
