import { AbstractModel } from "@/core/resources/model";
import {
  NoteLineEntity,
  NoteEntity,
  NotesMetaEntity,
  NotesReportEntity,
} from "@/features/accounting/domain/entities/notes";

export class NoteLineModel implements AbstractModel {
  constructor(
    public readonly label: string,
    public readonly bucket: string,
    public readonly amount: number,
    public readonly displayOrder: number,
  ) {}

  public static fromJson(raw: Record<string, any>): NoteLineModel {
    return new NoteLineModel(
      raw["label"] ?? "",
      raw["bucket"] ?? "",
      raw["amount"] ?? 0,
      raw["display_order"] ?? 0,
    );
  }

  public toEntity(): NoteLineEntity {
    return new NoteLineEntity(this.label, this.bucket, this.amount, this.displayOrder);
  }
}

export class NoteModel implements AbstractModel {
  constructor(
    public readonly noteNumber: number,
    public readonly paragraphRef: string,
    public readonly title: string,
    public readonly contentType: "text" | "line_items",
    public readonly kind: string,
    public readonly requiresTenantConfirmation: boolean,
    public readonly text: string | null,
    public readonly lines: NoteLineModel[] | null,
  ) {}

  public static fromJson(raw: Record<string, any>): NoteModel {
    return new NoteModel(
      raw["note_number"] ?? 0,
      raw["paragraph_ref"] ?? "",
      raw["title"] ?? "",
      raw["content_type"] !== undefined ? raw["content_type"] : "text",
      raw["kind"] ?? "",
      raw["requires_tenant_confirmation"] ?? false,
      raw["text"] ?? null,
      raw["lines"] == null ? null : (raw["lines"] as Record<string, any>[]).map(NoteLineModel.fromJson),
    );
  }

  public toEntity(): NoteEntity {
    const sortedLines =
      this.lines
        ?.map((l) => l.toEntity())
        .sort((a, b) => a.displayOrder - b.displayOrder) ?? null;

    return new NoteEntity(
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

export class NotesMetaModel implements AbstractModel {
  constructor(
    public readonly tenantId: string,
    public readonly entityName: string,
    public readonly title: string,
    public readonly subtitle: string,
    public readonly asOf: string,
    public readonly asOfDisplay: string,
    public readonly period: string,
    public readonly fiscalYearStartAsOf: string,
    public readonly periodStatus: "open" | "closed" | "locked",
    public readonly currency: string,
    public readonly generatedAt: string,
  ) {}

  public static fromJson(raw: Record<string, any>): NotesMetaModel {
    return new NotesMetaModel(
      raw["tenant_id"] ?? "",
      raw["entity_name"] ?? "",
      raw["title"] ?? "",
      raw["subtitle"] ?? "",
      raw["as_of"] ?? "",
      raw["as_of_display"] ?? "",
      raw["period"] ?? "",
      raw["fiscal_year_start_as_of"] ?? "",
      raw["period_status"] ?? "open",
      raw["currency"] ?? "",
      raw["generated_at"] ?? "",
    );
  }

  public toEntity(): NotesMetaEntity {
    return new NotesMetaEntity(
      this.tenantId,
      this.entityName,
      this.title,
      this.subtitle,
      this.asOf,
      this.asOfDisplay,
      this.period,
      this.fiscalYearStartAsOf,
      this.periodStatus,
      this.currency,
      this.generatedAt,
    );
  }
}

export class NotesModel implements AbstractModel {
  constructor(
    public readonly meta: NotesMetaModel,
    public readonly notes: NoteModel[],
  ) {}

  public static fromJson(raw: Record<string, any>): NotesModel {
    return new NotesModel(
      NotesMetaModel.fromJson(raw["meta"] ?? {}),
      (raw["notes"] ?? []).map(NoteModel.fromJson),
    );
  }

  public toEntity(): NotesReportEntity {
    const notes = this.notes
      .map((n) => n.toEntity())
      .sort((a, b) => a.noteNumber - b.noteNumber);

    return new NotesReportEntity(this.meta.toEntity(), notes);
  }
}
