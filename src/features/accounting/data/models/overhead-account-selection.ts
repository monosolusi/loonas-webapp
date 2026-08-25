import { AbstractModel } from "@/core/resources/model";
import { LedgerAccountModel } from "@/features/accounting/data/models/ledger-account";
import { OverheadAccountSelectionEntity } from "@/features/accounting/domain/entities/overhead-account-selection";

type OverheadAccountSelectionModelConstructor = {
  id: string;
  coaAccount: LedgerAccountModel;
  createdAt: string;
  updatedAt: string;
};

export class OverheadAccountSelectionModel implements AbstractModel {
  public readonly id: string;
  public readonly coaAccount: LedgerAccountModel;
  public readonly createdAt: string;
  public readonly updatedAt: string;

  constructor(args: OverheadAccountSelectionModelConstructor) {
    this.id = args.id;
    this.coaAccount = args.coaAccount;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  // NOTE: `id` here is the SELECTION ROW id, not the account id — the PUT payload must send
  // `coaAccount.id` (see OverheadAccountServiceImpl.replace). Confusing the two produces a
  // silent 404 on save, per the ticket's contract notes.
  public static fromJson(data: Record<string, any>): OverheadAccountSelectionModel {
    return new OverheadAccountSelectionModel({
      id: data["id"],
      coaAccount: LedgerAccountModel.fromJson(data["coa_account"]),
      createdAt: data["created_at"] ?? "",
      updatedAt: data["updated_at"] ?? "",
    });
  }

  public toEntity(): OverheadAccountSelectionEntity {
    return new OverheadAccountSelectionEntity({
      id: this.id,
      coaAccount: this.coaAccount.toEntity(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
