import { DateTime } from "luxon";
import { AbstractModel } from "@/core/resources/model";
import { AccountSettingAuditEntity } from "@/features/accounting/domain/entities/account-setting-audit";

export class AccountSettingAuditModel implements AbstractModel {
  constructor(
    public readonly id: string,
    public readonly accountId: string,
    public readonly actorRole: string,
    public readonly changedFields: Record<string, { prior: unknown; next: unknown }>,
    public readonly npwpClassification: "npwp_15" | "npwp_16" | "nik_as_npwp" | null,
    public readonly createdAt: Date,
  ) {}

  public static fromJson(data: Record<string, any>): AccountSettingAuditModel {
    const changedFields: Record<string, { prior: unknown; next: unknown }> = {};
    if (data["changed_fields"] && typeof data["changed_fields"] === "object") {
      for (const [key, value] of Object.entries(data["changed_fields"])) {
        const entry = value as Record<string, unknown>;
        changedFields[key] = { prior: entry["prior"], next: entry["next"] };
      }
    }

    return new AccountSettingAuditModel(
      data["id"] ?? "",
      data["account_id"] ?? "",
      data["actor_role"] ?? "",
      changedFields,
      data["npwp_classification"] ?? null,
      DateTime.fromISO(data["created_at"] ?? "").toJSDate(),
    );
  }

  public toEntity(): AccountSettingAuditEntity {
    return new AccountSettingAuditEntity({
      id: this.id,
      accountId: this.accountId,
      actorRole: this.actorRole,
      changedFields: this.changedFields,
      npwpClassification: this.npwpClassification,
      createdAt: this.createdAt,
    });
  }
}
