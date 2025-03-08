import { AbstractModel } from "@/core/resources/model";
import { DateTime } from "luxon";
import { UserEntity } from "@/app/(user)/_domain/_entities/user";

interface UserModelConstructor {
  id: string;
  email: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

export class UserModel implements AbstractModel {
  public id: string;
  public email: string;
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: UserModelConstructor) {
    this.id = args.id;
    this.email = args.email;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }

  public static fromJson(doc: Record<string, any>): UserModel {
    return new UserModel({
      id: doc.id,
      email: doc.email,
      createdAt: DateTime.fromISO(doc.created_at),
      updatedAt: DateTime.fromISO(doc.updated_at),
      deletedAt: doc.deleted_at && DateTime.fromISO(doc.deleted_at)
    });
  }

  toEntity(): UserEntity {
    return new UserEntity({
      id: this.id,
      email: this.email,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt
    });
  }

}