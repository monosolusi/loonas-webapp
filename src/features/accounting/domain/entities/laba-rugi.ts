import { AbstractEntity } from "@/core/resources/entity";

export class LabaRugiLineEntity implements AbstractEntity {
  constructor(
    public readonly id: string,
    public readonly accountCode: string,
    public readonly accountName: string,
    public readonly accountType: "revenue" | "cogs" | "expense",
    public readonly amount: number,
    public readonly isAbnormalBalance: boolean,
  ) {}
}

export class LabaRugiBucketEntity implements AbstractEntity {
  constructor(
    public readonly label: string,
    public readonly lines: LabaRugiLineEntity[],
    public readonly subtotal: number,
  ) {}
}

export class LabaRugiPeriodEntity implements AbstractEntity {
  constructor(
    public readonly pendapatan: LabaRugiBucketEntity,
    public readonly hargaPokokPenjualan: LabaRugiBucketEntity,
    public readonly labaKotor: number,
    public readonly biayaOperasional: LabaRugiBucketEntity,
    public readonly labaOperasional: number,
    public readonly pendapatanLainLain: LabaRugiBucketEntity | null,
    public readonly bebanLainLain: LabaRugiBucketEntity | null,
    public readonly labaSebelumPajak: number,
    public readonly pajak: LabaRugiBucketEntity,
    public readonly labaBersih: number,
  ) {}
}

export class LabaRugiMetaEntity implements AbstractEntity {
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

export class LabaRugiReportEntity implements AbstractEntity {
  constructor(
    public readonly meta: LabaRugiMetaEntity,
    public readonly current: LabaRugiPeriodEntity,
    public readonly compare: LabaRugiPeriodEntity | null,
  ) {}
}
