import { AbstractModel } from "@/core/resources/model";
import { JournalEntity } from "@/features/accounting/domain/entities/journal";
import { JournalLineModel } from "@/features/accounting/data/models/journal-line";

export class JournalModel implements AbstractModel {
  constructor(
    public readonly id: string,
    public readonly date: string,
    public readonly memo: string,
    public readonly referenceType: string | null,
    public readonly referenceId: string | null,
    public readonly lines: JournalLineModel[],
    public readonly createdAt: string,
  ) {}

  public static fromJson(data: Record<string, any>): JournalModel {
    return new JournalModel(
      data["id"],
      data["date"] ?? "",
      data["memo"] ?? "",
      data["reference_type"] ?? null,
      data["reference_id"] ?? null,
      Array.isArray(data["lines"]) ? data["lines"].map(JournalLineModel.fromJson) : [],
      data["created_at"] ?? "",
    );
  }

  public toEntity(): JournalEntity {
    return new JournalEntity({
      id: this.id,
      date: this.date,
      memo: this.memo,
      referenceType: this.referenceType,
      referenceId: this.referenceId,
      lines: this.lines.map((l) => l.toEntity()),
      createdAt: this.createdAt,
    });
  }
}
