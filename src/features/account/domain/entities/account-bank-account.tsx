import { DateTime } from "luxon";
import { AbstractEntity } from "@/core/resources/entity";

interface AccountBankAccountEntityConstructor {
  id: string;
  bankId: string;
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

export class AccountBankAccountEntity implements AbstractEntity {
  public id: string;
  public bankId: string;
  public bankName: string;
  public accountNumber: string;
  public accountHolderName: string;
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: AccountBankAccountEntityConstructor) {
    this.id = args.id;
    this.bankId = args.bankId;
    this.bankName = args.bankName;
    this.accountNumber = args.accountNumber;
    this.accountHolderName = args.accountHolderName;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }
}
