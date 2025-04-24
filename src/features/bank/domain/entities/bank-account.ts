import { AbstractEntity } from "@/core/resources/entity";
import { DateTime } from "luxon";

export class BankAccountEntity implements AbstractEntity {
  constructor(
    public id: string,
    public bankId: string,
    public bankName: string,
    public accountNumber: string,
    public accountHolderName: string,
    public partnerId: string,
    public createdAt: DateTime,
    public updatedAt: DateTime,
    public deletedAt?: DateTime
  ) {
  }
}