import { AbstractEntity } from "@/core/resources/entity";
import { DateTime } from "luxon";

interface UserEntityConstructor {
  id: string;
  email: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

export class UserEntity implements AbstractEntity {
  public id: string;
  public email: string;
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: UserEntityConstructor) {
    this.id = args.id;
    this.email = args.email;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }
}