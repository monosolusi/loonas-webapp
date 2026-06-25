import { AbstractEntity } from "@/core/resources/entity";

export class CalkLineEntity implements AbstractEntity {
  constructor(
    public readonly label: string,
    public readonly bucket: string,
    public readonly amount: number,
    public readonly displayOrder: number,
  ) {}
}

export class CalkNoteEntity implements AbstractEntity {
  constructor(
    public readonly noteNumber: number,
    public readonly paragraphRef: string,
    public readonly title: string,
    public readonly contentType: "text" | "line_items",
    public readonly kind: string,
    public readonly requiresTenantConfirmation: boolean,
    public readonly text: string | null,
    public readonly lines: CalkLineEntity[] | null,
  ) {}
}

export class CalkMetaEntity implements AbstractEntity {
  constructor(
    public readonly tenantId: string,
    public readonly entityName: string,
    public readonly title: string,
    public readonly subtitle: string,
    public readonly asOf: string,
    public readonly asOfDisplay: string,
    public readonly periode: string,
    public readonly fiscalYearStartAsOf: string,
    public readonly periodStatus: "open" | "closed" | "locked",
    public readonly currency: string,
    public readonly generatedAt: string,
  ) {}
}

export class CalkReportEntity implements AbstractEntity {
  constructor(
    public readonly meta: CalkMetaEntity,
    public readonly notes: CalkNoteEntity[],
  ) {}
}
