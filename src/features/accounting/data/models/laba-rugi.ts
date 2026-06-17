import { AbstractModel } from "@/core/resources/model";
import {
  LabaRugiLineEntity,
  LabaRugiBucketEntity,
  LabaRugiPeriodEntity,
  LabaRugiMetaEntity,
  LabaRugiReportEntity,
} from "@/features/accounting/domain/entities/laba-rugi";

export class LabaRugiLineModel implements AbstractModel {
  constructor(
    public readonly id: string,
    public readonly accountCode: string,
    public readonly accountName: string,
    public readonly accountType: "revenue" | "cogs" | "expense",
    public readonly amount: number,
    public readonly isAbnormalBalance: boolean,
  ) {}

  public static fromJson(raw: Record<string, any>, index: number): LabaRugiLineModel {
    return new LabaRugiLineModel(
      `${raw["account_code"] ?? "line"}-${index}`,
      raw["account_code"] ?? "",
      raw["account_name"] ?? "",
      raw["account_type"] ?? "expense",
      raw["amount"] ?? 0,
      raw["is_abnormal_balance"] ?? false,
    );
  }

  public toEntity(): LabaRugiLineEntity {
    return new LabaRugiLineEntity(
      this.id,
      this.accountCode,
      this.accountName,
      this.accountType,
      this.amount,
      this.isAbnormalBalance,
    );
  }
}

export class LabaRugiBucketModel implements AbstractModel {
  constructor(
    public readonly label: string,
    public readonly lines: LabaRugiLineModel[],
    public readonly subtotal: number,
  ) {}

  public static fromJson(raw: Record<string, any>): LabaRugiBucketModel {
    return new LabaRugiBucketModel(
      raw["label"] ?? "",
      (raw["lines"] ?? []).map((item: Record<string, any>, idx: number) => LabaRugiLineModel.fromJson(item, idx)),
      raw["subtotal"] ?? 0,
    );
  }

  public toEntity(): LabaRugiBucketEntity {
    return new LabaRugiBucketEntity(
      this.label,
      this.lines.map((l) => l.toEntity()),
      this.subtotal,
    );
  }
}

export class LabaRugiPeriodModel implements AbstractModel {
  constructor(
    public readonly pendapatan: LabaRugiBucketModel,
    public readonly hargaPokokPenjualan: LabaRugiBucketModel,
    public readonly labaKotor: number,
    public readonly biayaOperasional: LabaRugiBucketModel,
    public readonly labaOperasional: number,
    public readonly pendapatanLainLain: LabaRugiBucketModel | null,
    public readonly bebanLainLain: LabaRugiBucketModel | null,
    public readonly labaSebelumPajak: number,
    public readonly pajak: LabaRugiBucketModel,
    public readonly labaBersih: number,
  ) {}

  public static fromJson(raw: Record<string, any>): LabaRugiPeriodModel {
    return new LabaRugiPeriodModel(
      LabaRugiBucketModel.fromJson(raw["pendapatan"] ?? {}),
      LabaRugiBucketModel.fromJson(raw["harga_pokok_penjualan"] ?? {}),
      raw["laba_kotor"] ?? 0,
      LabaRugiBucketModel.fromJson(raw["biaya_operasional"] ?? {}),
      raw["laba_operasional"] ?? 0,
      raw["pendapatan_lain_lain"] ? LabaRugiBucketModel.fromJson(raw["pendapatan_lain_lain"]) : null,
      raw["beban_lain_lain"] ? LabaRugiBucketModel.fromJson(raw["beban_lain_lain"]) : null,
      raw["laba_sebelum_pajak"] ?? 0,
      LabaRugiBucketModel.fromJson(raw["pajak"] ?? {}),
      raw["laba_bersih"] ?? 0,
    );
  }

  public toEntity(): LabaRugiPeriodEntity {
    return new LabaRugiPeriodEntity(
      this.pendapatan.toEntity(),
      this.hargaPokokPenjualan.toEntity(),
      this.labaKotor,
      this.biayaOperasional.toEntity(),
      this.labaOperasional,
      this.pendapatanLainLain ? this.pendapatanLainLain.toEntity() : null,
      this.bebanLainLain ? this.bebanLainLain.toEntity() : null,
      this.labaSebelumPajak,
      this.pajak.toEntity(),
      this.labaBersih,
    );
  }
}

export class LabaRugiMetaModel implements AbstractModel {
  constructor(
    public readonly accountId: string,
    public readonly currency: string,
    public readonly from: string,
    public readonly to: string,
    public readonly compareFrom: string | null,
    public readonly compareTo: string | null,
    public readonly generatedAt: string,
  ) {}

  public static fromJson(raw: Record<string, any>): LabaRugiMetaModel {
    return new LabaRugiMetaModel(
      raw["account_id"] ?? "",
      raw["currency"] ?? "IDR",
      raw["from"] ?? "",
      raw["to"] ?? "",
      raw["compare_from"] ?? null,
      raw["compare_to"] ?? null,
      raw["generated_at"] ?? "",
    );
  }

  public toEntity(): LabaRugiMetaEntity {
    return new LabaRugiMetaEntity(
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

export class LabaRugiModel implements AbstractModel {
  constructor(
    public readonly meta: LabaRugiMetaModel,
    public readonly current: LabaRugiPeriodModel,
    public readonly compare: LabaRugiPeriodModel | null,
  ) {}

  public static fromJson(raw: Record<string, any>): LabaRugiModel {
    return new LabaRugiModel(
      LabaRugiMetaModel.fromJson(raw["meta"] ?? {}),
      LabaRugiPeriodModel.fromJson(raw["current"] ?? {}),
      raw["compare"] ? LabaRugiPeriodModel.fromJson(raw["compare"]) : null,
    );
  }

  public toEntity(): LabaRugiReportEntity {
    return new LabaRugiReportEntity(
      this.meta.toEntity(),
      this.current.toEntity(),
      this.compare ? this.compare.toEntity() : null,
    );
  }
}
