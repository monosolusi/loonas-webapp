import { AbstractModel } from "@/core/resources/model";
import { WarningEntryEntity } from "@/features/accounting/domain/entities/warning-entry";
import { WarningSeverity } from "@/features/accounting/domain/enums/warning-severity";

export class WarningEntryModel implements AbstractModel {
  constructor(
    public readonly code: string,
    public readonly severity: WarningSeverity,
    public readonly accountId: string | null,
    public readonly suggestedAlternative: string | null,
  ) {}

  public static fromJson(data: Record<string, any>): WarningEntryModel {
    const rawSeverity = data["severity"];
    const severity =
      rawSeverity === WarningSeverity.INFO || rawSeverity === WarningSeverity.HARD
        ? (rawSeverity as WarningSeverity)
        : WarningSeverity.WARNING;

    return new WarningEntryModel(
      data["code"] ?? "",
      severity,
      data["account_id"] ?? null,
      data["suggested_alternative"] ?? null,
    );
  }

  public toEntity(): WarningEntryEntity {
    return new WarningEntryEntity({
      code: this.code,
      severity: this.severity,
      accountId: this.accountId,
      suggestedAlternative: this.suggestedAlternative,
    });
  }
}
