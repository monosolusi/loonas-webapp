import { AbstractEntity } from "@/core/resources/entity";

export class IncomeStatementLineEntity implements AbstractEntity {
  constructor(
    public readonly id: string,
    public readonly accountCode: string,
    public readonly accountName: string,
    public readonly accountType: "revenue" | "cogs" | "expense",
    public readonly amount: number,
    public readonly isAbnormalBalance: boolean,
  ) {}
}

export class IncomeStatementBucketEntity implements AbstractEntity {
  constructor(
    public readonly label: string,
    public readonly lines: IncomeStatementLineEntity[],
    public readonly subtotal: number,
  ) {}
}

export class IncomeStatementPeriodEntity implements AbstractEntity {
  constructor(
    public readonly revenue: IncomeStatementBucketEntity,
    public readonly costOfGoodsSold: IncomeStatementBucketEntity,
    public readonly grossProfit: number,
    public readonly operatingExpenses: IncomeStatementBucketEntity,
    public readonly operatingProfit: number,
    public readonly otherIncome: IncomeStatementBucketEntity | null,
    public readonly otherExpenses: IncomeStatementBucketEntity | null,
    public readonly profitBeforeTax: number,
    public readonly tax: IncomeStatementBucketEntity,
    public readonly netProfit: number,
  ) {}
}

export class IncomeStatementMetaEntity implements AbstractEntity {
  constructor(
    public readonly accountId: string,
    public readonly currency: string,
    public readonly from: string,
    public readonly to: string,
    public readonly compareFrom: string | null,
    public readonly compareTo: string | null,
    public readonly generatedAt: string,
  ) {}
}

export class IncomeStatementReportEntity implements AbstractEntity {
  constructor(
    public readonly meta: IncomeStatementMetaEntity,
    public readonly current: IncomeStatementPeriodEntity,
    public readonly compare: IncomeStatementPeriodEntity | null,
  ) {}
}
