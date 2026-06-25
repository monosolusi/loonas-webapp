import { AbstractModel } from "@/core/resources/model";
import {
  CalkLineEntity,
  CalkNoteEntity,
  CalkMetaEntity,
  CalkReportEntity,
} from "@/features/accounting/domain/entities/calk";

export class CalkLineModel implements AbstractModel {
  constructor(
    public readonly label: string,
    public readonly bucket: string,
    public readonly amount: number,
    public readonly displayOrder: number,
  ) {}

  public static fromJson(raw: Record<string, any>): CalkLineModel {
    return new CalkLineModel(
      raw["label"] ?? "",
      raw["bucket"] ?? "",
      raw["amount"] ?? 0,
      raw["display_order"] ?? 0,
    );
  }

  public toEntity(): CalkLineEntity {
    return new CalkLineEntity(this.label, this.bucket, this.amount, this.displayOrder);
  }
}

export class CalkNoteModel implements AbstractModel {
  constructor(
    public readonly noteNumber: number,
    public readonly paragraphRef: string,
    public readonly title: string,
    public readonly contentType: "text" | "line_items",
    public readonly kind: string,
    public readonly requiresTenantConfirmation: boolean,
    public readonly text: string | null,
    public readonly lines: CalkLineModel[] | null,
  ) {}

  public static fromJson(raw: Record<string, any>): CalkNoteModel {
    return new CalkNoteModel(
      raw["note_number"] ?? 0,
      raw["paragraph_ref"] ?? "",
      raw["title"] ?? "",
      raw["content_type"] !== undefined ? raw["content_type"] : "text",
      raw["kind"] ?? "",
      raw["requires_tenant_confirmation"] ?? false,
      raw["text"] ?? null,
      raw["lines"] == null ? null : (raw["lines"] as Record<string, any>[]).map(CalkLineModel.fromJson),
    );
  }

  public toEntity(): CalkNoteEntity {
    const sortedLines =
      this.lines
        ?.map((l) => l.toEntity())
        .sort((a, b) => a.displayOrder - b.displayOrder) ?? null;

    return new CalkNoteEntity(
      this.noteNumber,
      this.paragraphRef,
      this.title,
      this.contentType,
      this.kind,
      this.requiresTenantConfirmation,
      this.text,
      sortedLines,
    );
  }
}

export class CalkMetaModel implements AbstractModel {
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

  public static fromJson(raw: Record<string, any>): CalkMetaModel {
    return new CalkMetaModel(
      raw["tenant_id"] ?? "",
      raw["entity_name"] ?? "",
      raw["title"] ?? "",
      raw["subtitle"] ?? "",
      raw["as_of"] ?? "",
      raw["as_of_display"] ?? "",
      raw["periode"] ?? "",
      raw["fiscal_year_start_as_of"] ?? "",
      raw["period_status"] ?? "open",
      raw["currency"] ?? "",
      raw["generated_at"] ?? "",
    );
  }

  public toEntity(): CalkMetaEntity {
    return new CalkMetaEntity(
      this.tenantId,
      this.entityName,
      this.title,
      this.subtitle,
      this.asOf,
      this.asOfDisplay,
      this.periode,
      this.fiscalYearStartAsOf,
      this.periodStatus,
      this.currency,
      this.generatedAt,
    );
  }
}

export class CalkModel implements AbstractModel {
  constructor(
    public readonly meta: CalkMetaModel,
    public readonly notes: CalkNoteModel[],
  ) {}

  public static fromJson(raw: Record<string, any>): CalkModel {
    return new CalkModel(
      CalkMetaModel.fromJson(raw["meta"] ?? {}),
      (raw["notes"] ?? []).map(CalkNoteModel.fromJson),
    );
  }

  public toEntity(): CalkReportEntity {
    const notes = this.notes
      .map((n) => n.toEntity())
      .sort((a, b) => a.noteNumber - b.noteNumber);

    return new CalkReportEntity(this.meta.toEntity(), notes);
  }
}
