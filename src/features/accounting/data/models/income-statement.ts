import { AbstractModel } from "@/core/resources/model";
import {
  IncomeStatementLineEntity,
  IncomeStatementBucketEntity,
  IncomeStatementPeriodEntity,
  IncomeStatementMetaEntity,
  IncomeStatementReportEntity,
} from "@/features/accounting/domain/entities/income-statement";

export class IncomeStatementLineModel implements AbstractModel {
  constructor(
    public readonly id: string,
    public readonly accountCode: string,
    public readonly accountName: string,
    public readonly accountType: "revenue" | "cogs" | "expense",
    public readonly amount: number,
    public readonly isAbnormalBalance: boolean,
  ) {}

  public static fromJson(raw: Record<string, any>, index: number): IncomeStatementLineModel {
    return new IncomeStatementLineModel(
      `${raw["account_code"] ?? "line"}-${index}`,
      raw["account_code"] ?? "",
      raw["account_name"] ?? "",
      raw["account_type"] ?? "expense",
      raw["amount"] ?? 0,
      raw["is_abnormal_balance"] ?? false,
    );
  }

  public toEntity(): IncomeStatementLineEntity {
    return new IncomeStatementLineEntity(
      this.id,
      this.accountCode,
      this.accountName,
      this.accountType,
      this.amount,
      this.isAbnormalBalance,
    );
  }
}

export class IncomeStatementBucketModel implements AbstractModel {
  constructor(
    public readonly label: string,
    public readonly lines: IncomeStatementLineModel[],
    public readonly subtotal: number,
  ) {}

  public static fromJson(raw: Record<string, any>): IncomeStatementBucketModel {
    return new IncomeStatementBucketModel(
      raw["label"] ?? "",
      (raw["lines"] ?? []).map((item: Record<string, any>, idx: number) => IncomeStatementLineModel.fromJson(item, idx)),
      raw["subtotal"] ?? 0,
    );
  }

  public toEntity(): IncomeStatementBucketEntity {
    return new IncomeStatementBucketEntity(
      this.label,
      this.lines.map((l) => l.toEntity()),
      this.subtotal,
    );
  }
}

export class IncomeStatementPeriodModel implements AbstractModel {
  constructor(
    public readonly revenue: IncomeStatementBucketModel,
    public readonly costOfGoodsSold: IncomeStatementBucketModel,
    public readonly grossProfit: number,
    public readonly operatingExpenses: IncomeStatementBucketModel,
    public readonly operatingProfit: number,
    public readonly otherIncome: IncomeStatementBucketModel | null,
    public readonly otherExpenses: IncomeStatementBucketModel | null,
    public readonly profitBeforeTax: number,
    public readonly tax: IncomeStatementBucketModel,
    public readonly netProfit: number,
  ) {}

  public static fromJson(raw: Record<string, any>): IncomeStatementPeriodModel {
    return new IncomeStatementPeriodModel(
      IncomeStatementBucketModel.fromJson(raw["revenue"] ?? {}),
      IncomeStatementBucketModel.fromJson(raw["cost_of_goods_sold"] ?? {}),
      raw["gross_profit"] ?? 0,
      IncomeStatementBucketModel.fromJson(raw["operating_expenses"] ?? {}),
      raw["operating_profit"] ?? 0,
      raw["other_income"] ? IncomeStatementBucketModel.fromJson(raw["other_income"]) : null,
      raw["other_expenses"] ? IncomeStatementBucketModel.fromJson(raw["other_expenses"]) : null,
      raw["profit_before_tax"] ?? 0,
      IncomeStatementBucketModel.fromJson(raw["tax"] ?? {}),
      raw["net_profit"] ?? 0,
    );
  }

  public toEntity(): IncomeStatementPeriodEntity {
    return new IncomeStatementPeriodEntity(
      this.revenue.toEntity(),
      this.costOfGoodsSold.toEntity(),
      this.grossProfit,
      this.operatingExpenses.toEntity(),
      this.operatingProfit,
      this.otherIncome ? this.otherIncome.toEntity() : null,
      this.otherExpenses ? this.otherExpenses.toEntity() : null,
      this.profitBeforeTax,
      this.tax.toEntity(),
      this.netProfit,
    );
  }
}

export class IncomeStatementMetaModel implements AbstractModel {
  constructor(
    public readonly accountId: string,
    public readonly currency: string,
    public readonly from: string,
    public readonly to: string,
    public readonly compareFrom: string | null,
    public readonly compareTo: string | null,
    public readonly generatedAt: string,
  ) {}

  public static fromJson(raw: Record<string, any>): IncomeStatementMetaModel {
    return new IncomeStatementMetaModel(
      raw["account_id"] ?? "",
      raw["currency"] ?? "IDR",
      raw["from"] ?? "",
      raw["to"] ?? "",
      raw["compare_from"] ?? null,
      raw["compare_to"] ?? null,
      raw["generated_at"] ?? "",
    );
  }

  public toEntity(): IncomeStatementMetaEntity {
    return new IncomeStatementMetaEntity(
      this.accountId,
      this.currency,
      this.from,
      this.to,
      this.compareFrom,
      this.compareTo,
      this.generatedAt,
    );
  }
}

export class IncomeStatementModel implements AbstractModel {
  constructor(
    public readonly meta: IncomeStatementMetaModel,
    public readonly current: IncomeStatementPeriodModel,
    public readonly compare: IncomeStatementPeriodModel | null,
  ) {}

  public static fromJson(raw: Record<string, any>): IncomeStatementModel {
    return new IncomeStatementModel(
      IncomeStatementMetaModel.fromJson(raw["meta"] ?? {}),
      IncomeStatementPeriodModel.fromJson(raw["current"] ?? {}),
      raw["compare"] ? IncomeStatementPeriodModel.fromJson(raw["compare"]) : null,
    );
  }

  public toEntity(): IncomeStatementReportEntity {
    return new IncomeStatementReportEntity(
      this.meta.toEntity(),
      this.current.toEntity(),
      this.compare ? this.compare.toEntity() : null,
    );
  }
}
