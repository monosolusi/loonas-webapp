import { AbstractEntity } from "@/core/resources/entity";

export class BalanceSheetLineEntity implements AbstractEntity {
  constructor(
    public readonly id: string,
    public readonly accountCode: string,
    public readonly accountName: string,
    public readonly balanceAsOf: number,
    public readonly isAbnormalBalance: boolean,
    public readonly isVirtual: boolean,
    public readonly displayOrder: number,
    public readonly compareTo?: number,
  ) {}
}

export class BalanceSheetBucketEntity implements AbstractEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly displayOrder: number,
    public readonly lines: BalanceSheetLineEntity[],
    public readonly subtotal: number,
    public readonly compareTo?: number,
  ) {}
}

export class BalanceSheetSectionEntity implements AbstractEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly displayOrder: number,
    public readonly buckets: BalanceSheetBucketEntity[],
    public readonly total: number,
    public readonly compareTo?: number,
  ) {}
}

export class BalanceSheetReportEntity implements AbstractEntity {
  constructor(
    public readonly asOf: string,
    public readonly sections: BalanceSheetSectionEntity[],
    public readonly grandTotal: number,
    public readonly isBalanced: boolean,
    public readonly imbalanceDelta: number,
  ) {}
}
