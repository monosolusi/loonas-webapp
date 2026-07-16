import { AbstractModel } from "@/core/resources/model";
import {
  BalanceSheetLineEntity,
  BalanceSheetBucketEntity,
  BalanceSheetSectionEntity,
  BalanceSheetReportEntity,
} from "@/features/accounting/domain/entities/balance-sheet";

export class BalanceSheetLineModel implements AbstractModel {
  constructor(
    public readonly id: string,
    public readonly accountCode: string,
    public readonly accountName: string,
    public readonly balanceAsOf: number,
    public readonly isAbnormalBalance: boolean,
    public readonly isVirtual: boolean,
    public readonly displayOrder: number,
    public readonly compareTo: number | undefined,
  ) {}

  public static fromJson(raw: Record<string, any>, index = 0): BalanceSheetLineModel {
    return new BalanceSheetLineModel(
      `${raw["account_code"] ?? "line"}-${index}`,
      raw["account_code"] ?? "",
      raw["account_name"] ?? "",
      raw["balance_as_of"] ?? 0,
      raw["is_abnormal_balance"] ?? false,
      raw["is_virtual"] ?? false,
      index,
      raw["balance_compare_to"] !== undefined ? raw["balance_compare_to"] : undefined,
    );
  }

  public toEntity(): BalanceSheetLineEntity {
    return new BalanceSheetLineEntity(
      this.id,
      this.accountCode,
      this.accountName,
      this.balanceAsOf,
      this.isAbnormalBalance,
      this.isVirtual,
      this.displayOrder,
      this.compareTo,
    );
  }
}

export class BalanceSheetBucketModel implements AbstractModel {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly displayOrder: number,
    public readonly lines: BalanceSheetLineModel[],
    public readonly subtotal: number,
    public readonly compareTo: number | undefined,
  ) {}

  public static fromJson(raw: Record<string, any>): BalanceSheetBucketModel {
    return new BalanceSheetBucketModel(
      raw["bucket"] ?? "",
      raw["label"] ?? "",
      raw["display_order"] ?? 0,
      (raw["lines"] ?? []).map((item: Record<string, any>, idx: number) => BalanceSheetLineModel.fromJson(item, idx)),
      raw["subtotal_as_of"] ?? 0,
      raw["subtotal_compare_to"] !== undefined ? raw["subtotal_compare_to"] : undefined,
    );
  }

  public toEntity(): BalanceSheetBucketEntity {
    const sortedLines = this.lines
      .map((l) => l.toEntity())
      .sort((a, b) => a.displayOrder - b.displayOrder);
    return new BalanceSheetBucketEntity(this.id, this.name, this.displayOrder, sortedLines, this.subtotal, this.compareTo);
  }
}

export class BalanceSheetSectionModel implements AbstractModel {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly displayOrder: number,
    public readonly buckets: BalanceSheetBucketModel[],
    public readonly total: number,
    public readonly compareTo: number | undefined,
  ) {}

  public static fromJson(raw: Record<string, any>): BalanceSheetSectionModel {
    return new BalanceSheetSectionModel(
      raw["section"] ?? "",
      raw["label"] ?? "",
      raw["display_order"] ?? 0,
      (raw["buckets"] ?? []).map(BalanceSheetBucketModel.fromJson),
      raw["total_as_of"] ?? 0,
      raw["total_compare_to"] !== undefined ? raw["total_compare_to"] : undefined,
    );
  }

  public toEntity(): BalanceSheetSectionEntity {
    const sortedBuckets = this.buckets
      .map((b) => b.toEntity())
      .sort((a, b) => a.displayOrder - b.displayOrder);
    return new BalanceSheetSectionEntity(this.id, this.name, this.displayOrder, sortedBuckets, this.total, this.compareTo);
  }
}

export class BalanceSheetModel implements AbstractModel {
  constructor(
    public readonly asOf: string,
    public readonly sections: BalanceSheetSectionModel[],
    public readonly grandTotal: number,
    public readonly isBalanced: boolean,
    public readonly imbalanceDelta: number,
  ) {}

  public static fromJson(raw: Record<string, any>): BalanceSheetModel {
    return new BalanceSheetModel(
      raw["meta"]?.["as_of"] ?? "",
      (raw["sections"] ?? []).map(BalanceSheetSectionModel.fromJson),
      raw["totals"]?.["total_assets_as_of"] ?? 0,
      raw["_imbalance"]?.["is_balanced"] ?? true,
      raw["_imbalance"]?.["delta"] ?? 0,
    );
  }

  public toEntity(): BalanceSheetReportEntity {
    const sortedSections = this.sections
      .map((s) => s.toEntity())
      .sort((a, b) => a.displayOrder - b.displayOrder);
    return new BalanceSheetReportEntity(this.asOf, sortedSections, this.grandTotal, this.isBalanced, this.imbalanceDelta);
  }
}
