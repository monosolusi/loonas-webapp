import { DateTime } from "luxon";
import { AbstractEntity } from "@/core/resources/entity";

interface FileEntityConstructor {
  id: string;
  name: string;
  publicUrl: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

export class FileEntity implements AbstractEntity {
  public id: string;
  public name: string;
  public publicUrl: string;
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: FileEntityConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.publicUrl = args.publicUrl;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }
}
