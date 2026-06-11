import { AbstractModel } from "@/core/resources/model";
import { BankEntity } from "@/features/bank/domain/entities/bank";
import { DateTime } from "luxon";

interface BankModelConstructor {
  id: string;
  name: string;
  code: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

export class BankModel implements AbstractModel {
  public id: string;
  public name: string;
  public code: string;
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: BankModelConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.code = args.code;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }

  public static fromJson(doc: Record<string, any>): BankModel {
    return new BankModel({
      id: doc["id"],
      name: doc["name"],
      code: doc["code"],
      createdAt: DateTime.fromISO(doc["created_at"]),
      updatedAt: DateTime.fromISO(doc["updated_at"]),
      deletedAt: doc["deleted_at"] ? DateTime.fromISO(doc["deleted_at"]) : undefined
    });
  }

  toEntity(): BankEntity {
    return new BankEntity(
      this.id,
      this.name,
      this.code,
      this.createdAt,
      this.updatedAt,
      this.deletedAt
    );
  }
}