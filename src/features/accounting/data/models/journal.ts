import { AbstractModel } from "@/core/resources/model";
import { JournalEntity, JournalPostedBy } from "@/features/accounting/domain/entities/journal";
import { JournalLineModel } from "@/features/accounting/data/models/journal-line";

export class JournalPostedByModel implements AbstractModel {
  constructor(
    public readonly kind: "user" | "system",
    public readonly label: string,
  ) {}

  public static fromJson(data: Record<string, any>): JournalPostedByModel {
    return new JournalPostedByModel(data["kind"] ?? "system", data["label"] ?? "");
  }

  public toValue(): JournalPostedBy {
    return { kind: this.kind, label: this.label };
  }
}

export class JournalModel implements AbstractModel {
  constructor(
    public readonly id: string,
    public readonly date: string,
    public readonly memo: string,
    public readonly referenceType: string | null,
    public readonly referenceId: string | null,
    public readonly lines: JournalLineModel[],
    public readonly createdAt: string,
    public readonly postedBy: JournalPostedByModel | null,
    public readonly isReversal: boolean,
    public readonly reversedJournalId: string | null,
    public readonly supersededById: string | null,
    public readonly isReversedCurrently: boolean,
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
      data["posted_by"] != null ? JournalPostedByModel.fromJson(data["posted_by"]) : null,
      data["is_reversal"] ?? false,
      data["reversed_journal_id"] ?? null,
      data["superseded_by_id"] ?? null,
      data["is_reversed_currently"] ?? false,
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
      postedBy: this.postedBy != null ? this.postedBy.toValue() : null,
      isReversal: this.isReversal,
      reversedJournalId: this.reversedJournalId,
      supersededById: this.supersededById,
      isReversedCurrently: this.isReversedCurrently,
    });
  }
}
