import { AbstractEntity } from "@/core/resources/entity";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";

type OverheadAccountSelectionEntityConstructor = {
  id: string;
  coaAccount: LedgerAccountEntity;
  createdAt: string;
  updatedAt: string;
};

export class OverheadAccountSelectionEntity implements AbstractEntity {
  public readonly id: string;
  public readonly coaAccount: LedgerAccountEntity;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(args: OverheadAccountSelectionEntityConstructor) {
    this.id = args.id;
    this.coaAccount = args.coaAccount;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }
}
