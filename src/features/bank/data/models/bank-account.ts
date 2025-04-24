import { DateTime } from "luxon";
import { AbstractModel } from "@/core/resources/model";
import { BankAccountEntity } from "@/features/bank/domain/entities/bank-account";

interface BankAccountModelConstructor {
  id: string;
  bankId: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  partnerId: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

export class BankAccountModel implements AbstractModel {
  public id: string;
  public bankId: string;
  public bankName: string;
  public accountNumber: string;
  public accountHolderName: string;
  public partnerId: string;
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: BankAccountModelConstructor) {
    this.id = args.id;
    this.bankId = args.bankId;
    this.bankName = args.bankName;
    this.accountNumber = args.accountNumber;
    this.accountHolderName = args.accountHolderName;
    this.partnerId = args.partnerId;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }

  public static fromJson(doc: Record<string, any>): BankAccountModel {
    return new BankAccountModel({
      id: doc["id"],
      bankId: doc["bank"]["id"],
      bankName: doc["bank"]["name"],
      accountNumber: doc["account_number"],
      accountHolderName: doc["account_holder_name"],
      partnerId: doc["partner_id"],
      createdAt: DateTime.fromISO(doc["created_at"]),
      updatedAt: DateTime.fromISO(doc["updated_at"]),
      deletedAt: doc["deleted_at"] ? DateTime.fromISO(doc["deleted_at"]) : undefined
    });
  }

  toEntity(): BankAccountEntity {
    return new BankAccountEntity(
      this.id,
      this.bankId,
      this.bankName,
      this.accountNumber,
      this.accountHolderName,
      this.partnerId,
      this.createdAt,
      this.updatedAt,
      this.deletedAt
    );
  }
}