import { AbstractEntity } from "@/core/resources/entity";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";

type CoaMappingEntityConstructor = {
  id: string;
  entityType: string;
  entityId: string | null;
  debitAccount: LedgerAccountEntity;
  creditAccount: LedgerAccountEntity;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
};

export class CoaMappingEntity implements AbstractEntity {
  public readonly id: string;
  public readonly entityType: string;
  public readonly entityId: string | null;
  public readonly debitAccount: LedgerAccountEntity;
  public readonly creditAccount: LedgerAccountEntity;
  public readonly isSystem: boolean;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(args: CoaMappingEntityConstructor) {
    this.id = args.id;
    this.entityType = args.entityType;
    this.entityId = args.entityId;
    this.debitAccount = args.debitAccount;
    this.creditAccount = args.creditAccount;
    this.isSystem = args.isSystem;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }
}
