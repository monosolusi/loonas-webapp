import { AbstractModel } from "@/core/resources/model";
import {
  ArusKasLineEntity,
  ArusKasSubtotalEntity,
  ArusKasOperasiSectionEntity,
  ArusKasSectionEntity,
  ArusKasMetaEntity,
  ArusKasReportEntity,
} from "@/features/accounting/domain/entities/arus-kas";

export class ArusKasLineModel implements AbstractModel {
  constructor(
    public readonly label: string,
    public readonly rawBalanceDelta: number,
    public readonly cashImpactDelta: number,
    public readonly isAbnormalBalance: boolean,
  ) {}

  public static fromJson(raw: Record<string, any>): ArusKasLineModel {
    return new ArusKasLineModel(
      raw["label"] ?? "",
      raw["raw_balance_delta"] ?? 0,
      raw["cash_impact_delta"] ?? 0,
      raw["is_abnormal_balance"] ?? false,
    );
  }

  public toEntity(): ArusKasLineEntity {
    return new ArusKasLineEntity(
      this.label,
      this.rawBalanceDelta,
      this.cashImpactDelta,
      this.isAbnormalBalance,
    );
  }
}

export class ArusKasSubtotalModel implements AbstractModel {
  constructor(
    public readonly label: string,
    public readonly amount: number,
  ) {}

  public static fromJson(raw: Record<string, any>): ArusKasSubtotalModel {
    return new ArusKasSubtotalModel(
      raw["label"] ?? "",
      raw["amount"] ?? 0,
    );
  }

  public toEntity(): ArusKasSubtotalEntity {
    return new ArusKasSubtotalEntity(this.label, this.amount);
  }
}

export class ArusKasOperasiSectionModel implements AbstractModel {
  constructor(
    public readonly label: string,
    public readonly labaBersih: number,
    public readonly penyesuaian: ArusKasLineModel[],
    public readonly perubahanModalKerja: ArusKasLineModel[],
    public readonly subtotal: ArusKasSubtotalModel,
  ) {}

  public static fromJson(raw: Record<string, any>): ArusKasOperasiSectionModel {
    return new ArusKasOperasiSectionModel(
      raw["label"] ?? "",
      raw["laba_bersih"] ?? 0,
      (raw["penyesuaian"] ?? []).map(ArusKasLineModel.fromJson),
      (raw["perubahan_modal_kerja"] ?? []).map(ArusKasLineModel.fromJson),
      ArusKasSubtotalModel.fromJson(raw["subtotal"] ?? {}),
    );
  }

  public toEntity(): ArusKasOperasiSectionEntity {
    return new ArusKasOperasiSectionEntity(
      this.label,
      this.labaBersih,
      this.penyesuaian.map((l) => l.toEntity()),
      this.perubahanModalKerja.map((l) => l.toEntity()),
      this.subtotal.toEntity(),
    );
  }
}

export class ArusKasSectionModel implements AbstractModel {
  constructor(
    public readonly label: string,
    public readonly lines: ArusKasLineModel[],
    public readonly subtotal: ArusKasSubtotalModel,
  ) {}

  public static fromJson(raw: Record<string, any>): ArusKasSectionModel {
    return new ArusKasSectionModel(
      raw["label"] ?? "",
      (raw["lines"] ?? []).map(ArusKasLineModel.fromJson),
      ArusKasSubtotalModel.fromJson(raw["subtotal"] ?? {}),
    );
  }

  public toEntity(): ArusKasSectionEntity {
    return new ArusKasSectionEntity(
      this.label,
      this.lines.map((l) => l.toEntity()),
      this.subtotal.toEntity(),
    );
  }
}

export class ArusKasMetaModel implements AbstractModel {
  constructor(
    public readonly accountId: string,
    public readonly currency: string,
    public readonly periodFrom: string,
    public readonly periodTo: string,
    public readonly entityTypeUsedForLabels: "op" | "op_fallback" | "cv_firma" | "pt" | "koperasi",
    public readonly generatedAt: string,
    public readonly periodStatuses: { readonly period: string; readonly status: "open" | "closed" }[],
  ) {}

  public static fromJson(raw: Record<string, any>): ArusKasMetaModel {
    return new ArusKasMetaModel(
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

  public toEntity(): ArusKasMetaEntity {
    return new ArusKasMetaEntity(
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

export class ArusKasModel implements AbstractModel {
  constructor(
    public readonly meta: ArusKasMetaModel,
    public readonly operasi: ArusKasOperasiSectionModel,
    public readonly investasi: ArusKasSectionModel,
    public readonly pendanaan: ArusKasSectionModel,
    public readonly totalArusKas: number,
    public readonly totalArusKasLabel: string,
    public readonly saldoKasAwal: number,
    public readonly saldoKasAwalLabel: string,
    public readonly saldoKasAkhir: number,
    public readonly saldoKasAkhirLabel: string,
    public readonly nonCashTransactions: Record<string, any>[],
    public readonly isBalanced: boolean,
    public readonly imbalanceDelta: number,
  ) {}

  public static fromJson(raw: Record<string, any>): ArusKasModel {
    return new ArusKasModel(
      ArusKasMetaModel.fromJson(raw["meta"] ?? {}),
      ArusKasOperasiSectionModel.fromJson(raw["operasi"] ?? {}),
      ArusKasSectionModel.fromJson(raw["investasi"] ?? {}),
      ArusKasSectionModel.fromJson(raw["pendanaan"] ?? {}),
      raw["total_arus_kas"] ?? 0,
      raw["total_arus_kas_label"] ?? "",
      raw["saldo_kas_awal"] ?? 0,
      raw["saldo_kas_awal_label"] ?? "",
      raw["saldo_kas_akhir"] ?? 0,
      raw["saldo_kas_akhir_label"] ?? "",
      raw["non_cash_transactions"] ?? [],
      raw["_imbalance"]?.["is_balanced"] ?? true,
      raw["_imbalance"]?.["delta"] ?? 0,
    );
  }

  public toEntity(): ArusKasReportEntity {
    return new ArusKasReportEntity(
      this.meta.toEntity(),
      this.operasi.toEntity(),
      this.investasi.toEntity(),
      this.pendanaan.toEntity(),
      this.totalArusKas,
      this.totalArusKasLabel,
      this.saldoKasAwal,
      this.saldoKasAwalLabel,
      this.saldoKasAkhir,
      this.saldoKasAkhirLabel,
      this.nonCashTransactions,
      this.isBalanced,
      this.imbalanceDelta,
    );
  }
}
