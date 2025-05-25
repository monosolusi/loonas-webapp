import { DateTime } from "luxon";
import { AbstractModel } from "@/core/resources/model";
import { AccountBankAccountEntity } from "@/features/account/domain/entities/account-bank-account";

interface AccountBankAccountModelConstructor {
  id: string;
  bankId: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

export class AccountBankAccountModel implements AbstractModel {
  public id: string;
  public bankId: string;
  public bankName: string;
  public accountNumber: string;
  public accountHolderName: string;
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: AccountBankAccountModelConstructor) {
    this.id = args.id;
    this.bankId = args.bankId;
    this.bankName = args.bankName;
    this.accountNumber = args.accountNumber;
    this.accountHolderName = args.accountHolderName;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }

  public static fromJson(doc: Record<string, any>): AccountBankAccountModel {
    return new AccountBankAccountModel({
      id: doc["id"],
      bankId: doc["bank_id"],
      bankName: doc["bank_name"],
      accountNumber: doc["account_number"],
      accountHolderName: doc["account_holder_name"],
      createdAt: DateTime.fromISO(doc["created_at"]),
      updatedAt: DateTime.fromISO(doc["updated_at"]),
      deletedAt: doc["deleted_at"] && DateTime.fromISO(doc["deleted_at"])
    });
  }

  toEntity(): AccountBankAccountEntity {
    return new AccountBankAccountEntity({
      id: this.id,
      bankId: this.bankId,
      bankName: this.bankName,
      accountNumber: this.accountNumber,
      accountHolderName: this.accountHolderName,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt
    });
  }
}
