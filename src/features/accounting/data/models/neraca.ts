import { AbstractModel } from "@/core/resources/model";
import {
  NeracaLineEntity,
  NeracaBucketEntity,
  NeracaSectionEntity,
  NeracaReportEntity,
} from "@/features/accounting/domain/entities/neraca";

export class NeracaLineModel implements AbstractModel {
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

  public static fromJson(raw: Record<string, any>, index = 0): NeracaLineModel {
    return new NeracaLineModel(
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

  public toEntity(): NeracaLineEntity {
    return new NeracaLineEntity(
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

export class NeracaBucketModel implements AbstractModel {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly displayOrder: number,
    public readonly lines: NeracaLineModel[],
    public readonly subtotal: number,
    public readonly compareTo: number | undefined,
  ) {}

  public static fromJson(raw: Record<string, any>): NeracaBucketModel {
    return new NeracaBucketModel(
      raw["bucket"] ?? "",
      raw["label"] ?? "",
      raw["display_order"] ?? 0,
      (raw["lines"] ?? []).map((item: Record<string, any>, idx: number) => NeracaLineModel.fromJson(item, idx)),
      raw["subtotal_as_of"] ?? 0,
      raw["subtotal_compare_to"] !== undefined ? raw["subtotal_compare_to"] : undefined,
    );
  }

  public toEntity(): NeracaBucketEntity {
    const sortedLines = this.lines
      .map((l) => l.toEntity())
      .sort((a, b) => a.displayOrder - b.displayOrder);
    return new NeracaBucketEntity(this.id, this.name, this.displayOrder, sortedLines, this.subtotal, this.compareTo);
  }
}

export class NeracaSectionModel implements AbstractModel {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly displayOrder: number,
    public readonly buckets: NeracaBucketModel[],
    public readonly total: number,
    public readonly compareTo: number | undefined,
  ) {}

  public static fromJson(raw: Record<string, any>): NeracaSectionModel {
    return new NeracaSectionModel(
      raw["section"] ?? "",
      raw["label"] ?? "",
      raw["display_order"] ?? 0,
      (raw["buckets"] ?? []).map(NeracaBucketModel.fromJson),
      raw["total_as_of"] ?? 0,
      raw["total_compare_to"] !== undefined ? raw["total_compare_to"] : undefined,
    );
  }

  public toEntity(): NeracaSectionEntity {
    const sortedBuckets = this.buckets
      .map((b) => b.toEntity())
      .sort((a, b) => a.displayOrder - b.displayOrder);
    return new NeracaSectionEntity(this.id, this.name, this.displayOrder, sortedBuckets, this.total, this.compareTo);
  }
}

export class NeracaModel implements AbstractModel {
  constructor(
    public readonly asOf: string,
    public readonly sections: NeracaSectionModel[],
    public readonly grandTotal: number,
    public readonly isBalanced: boolean,
    public readonly imbalanceDelta: number,
  ) {}

  public static fromJson(raw: Record<string, any>): NeracaModel {
    return new NeracaModel(
      raw["meta"]?.["as_of"] ?? "",
      (raw["sections"] ?? []).map(NeracaSectionModel.fromJson),
      raw["totals"]?.["total_aset_as_of"] ?? 0,
      raw["_imbalance"]?.["is_balanced"] ?? true,
      raw["_imbalance"]?.["delta"] ?? 0,
    );
  }

  public toEntity(): NeracaReportEntity {
    const sortedSections = this.sections
      .map((s) => s.toEntity())
      .sort((a, b) => a.displayOrder - b.displayOrder);
    return new NeracaReportEntity(this.asOf, sortedSections, this.grandTotal, this.isBalanced, this.imbalanceDelta);
  }
}
