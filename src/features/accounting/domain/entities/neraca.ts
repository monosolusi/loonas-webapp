import { AbstractEntity } from "@/core/resources/entity";

export class NeracaLineEntity implements AbstractEntity {
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

export class NeracaBucketEntity implements AbstractEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly displayOrder: number,
    public readonly lines: NeracaLineEntity[],
    public readonly subtotal: number,
    public readonly compareTo?: number,
  ) {}
}

export class NeracaSectionEntity implements AbstractEntity {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly displayOrder: number,
    public readonly buckets: NeracaBucketEntity[],
    public readonly total: number,
    public readonly compareTo?: number,
  ) {}
}

export class NeracaReportEntity implements AbstractEntity {
  constructor(
    public readonly asOf: string,
    public readonly sections: NeracaSectionEntity[],
    public readonly grandTotal: number,
    public readonly isBalanced: boolean,
    public readonly imbalanceDelta: number,
  ) {}
}
