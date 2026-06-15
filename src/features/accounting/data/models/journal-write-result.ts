import { AbstractModel } from "@/core/resources/model";
import { JournalModel } from "@/features/accounting/data/models/journal";
import { WarningEntryModel } from "@/features/accounting/data/models/warning-entry";
import { JournalEntity } from "@/features/accounting/domain/entities/journal";
import { WarningEntryEntity } from "@/features/accounting/domain/entities/warning-entry";

export type JournalWriteResultEntity = {
  journal: JournalEntity;
  warnings: WarningEntryEntity[];
};

export class JournalWriteResultModel implements AbstractModel {
  constructor(
    public readonly journal: JournalModel,
    public readonly warnings: WarningEntryModel[],
  ) {}

  public static fromJson(data: Record<string, any>): JournalWriteResultModel {
    return new JournalWriteResultModel(
      JournalModel.fromJson(data["data"]),
      Array.isArray(data["warnings"]) ? data["warnings"].map(WarningEntryModel.fromJson) : [],
    );
  }

  public toEntity(): JournalWriteResultEntity {
    return {
      journal: this.journal.toEntity(),
      warnings: this.warnings.map((w) => w.toEntity()),
    };
  }
}
