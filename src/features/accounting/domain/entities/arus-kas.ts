import { AbstractEntity } from "@/core/resources/entity";

export class ArusKasLineEntity implements AbstractEntity {
  constructor(
    public readonly label: string,
    public readonly rawBalanceDelta: number,
    public readonly cashImpactDelta: number,
    public readonly isAbnormalBalance: boolean,
  ) {}
}

export class ArusKasSubtotalEntity implements AbstractEntity {
  constructor(
    public readonly label: string,
    public readonly amount: number,
  ) {}
}

export class ArusKasOperasiSectionEntity implements AbstractEntity {
  constructor(
    public readonly label: string,
    public readonly labaBersih: number,
    public readonly penyesuaian: ArusKasLineEntity[],
    public readonly perubahanModalKerja: ArusKasLineEntity[],
    public readonly subtotal: ArusKasSubtotalEntity,
  ) {}
}

export class ArusKasSectionEntity implements AbstractEntity {
  constructor(
    public readonly label: string,
    public readonly lines: ArusKasLineEntity[],
    public readonly subtotal: ArusKasSubtotalEntity,
  ) {}
}

export class ArusKasMetaEntity implements AbstractEntity {
  constructor(
    public readonly accountId: string,
    public readonly currency: string,
    public readonly periodFrom: string,
    public readonly periodTo: string,
    public readonly entityTypeUsedForLabels: "op" | "op_fallback" | "cv_firma" | "pt" | "koperasi",
    public readonly generatedAt: string,
    public readonly periodStatuses: { readonly period: string; readonly status: "open" | "closed" }[],
  ) {}
}

export class ArusKasReportEntity implements AbstractEntity {
  constructor(
    public readonly meta: ArusKasMetaEntity,
    public readonly operasi: ArusKasOperasiSectionEntity,
    public readonly investasi: ArusKasSectionEntity,
    public readonly pendanaan: ArusKasSectionEntity,
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
}
