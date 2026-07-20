import { AbstractEntity } from "@/core/resources/entity";

export type NpwpClassification = "npwp_15" | "npwp_16" | "nik_as_npwp";

type AccountSettingAuditEntityConstructor = {
  id: string;
  accountId: string;
  actorRole: string;
  changedFields: Record<string, { prior: unknown; next: unknown }>;
  npwpClassification: NpwpClassification | null;
  createdAt: Date;
};

export class AccountSettingAuditEntity implements AbstractEntity {
  public readonly id: string;
  public readonly accountId: string;
  public readonly actorRole: string;
  public readonly changedFields: Record<string, { prior: unknown; next: unknown }>;
  public readonly npwpClassification: NpwpClassification | null;
  public readonly createdAt: Date;

  constructor(args: AccountSettingAuditEntityConstructor) {
    this.id = args.id;
    this.accountId = args.accountId;
    this.actorRole = args.actorRole;
    this.changedFields = args.changedFields;
    this.npwpClassification = args.npwpClassification;
    this.createdAt = args.createdAt;
  }
}
