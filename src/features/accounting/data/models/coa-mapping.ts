import { AbstractModel } from "@/core/resources/model";
import { LedgerAccountModel } from "@/features/accounting/data/models/ledger-account";
import { CoaMappingEntity } from "@/features/accounting/domain/entities/coa-mapping";

type CoaMappingModelConstructor = {
  id: string;
  entityType: string;
  entityId: string | null;
  debitAccount: LedgerAccountModel;
  creditAccount: LedgerAccountModel;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
};

export class CoaMappingModel implements AbstractModel {
  public readonly id: string;
  public readonly entityType: string;
  public readonly entityId: string | null;
  public readonly debitAccount: LedgerAccountModel;
  public readonly creditAccount: LedgerAccountModel;
  public readonly isSystem: boolean;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(args: CoaMappingModelConstructor) {
    this.id = args.id;
    this.entityType = args.entityType;
    this.entityId = args.entityId;
    this.debitAccount = args.debitAccount;
    this.creditAccount = args.creditAccount;
    this.isSystem = args.isSystem;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  public static fromJson(data: Record<string, any>): CoaMappingModel {
    return new CoaMappingModel({
      id: data["id"],
      entityType: data["entity_type"],
      entityId: data["entity_id"] ?? null,
      debitAccount: LedgerAccountModel.fromJson(data["debit_account"]),
      creditAccount: LedgerAccountModel.fromJson(data["credit_account"]),
      isSystem: data["is_system"] ?? false,
      createdAt: data["created_at"] ?? "",
      updatedAt: data["updated_at"] ?? "",
    });
  }

  public toEntity(): CoaMappingEntity {
    return new CoaMappingEntity({
      id: this.id,
      entityType: this.entityType,
      entityId: this.entityId,
      debitAccount: this.debitAccount.toEntity(),
      creditAccount: this.creditAccount.toEntity(),
      isSystem: this.isSystem,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
