import { DateTime } from "luxon";
import { AbstractModel } from "@/core/resources/model";
import { FileEntity } from "@/features/file/domain/entities/file";

interface FileModelConstructor {
  id: string;
  name: string;
  publicUrl: string;
  createdAt: DateTime;
  updatedAt: DateTime;
  deletedAt?: DateTime;
}

export class FileModel implements AbstractModel {
  public id: string;
  public name: string;
  public publicUrl: string;
  public createdAt: DateTime;
  public updatedAt: DateTime;
  public deletedAt?: DateTime;

  constructor(args: FileModelConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.publicUrl = args.publicUrl;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
    this.deletedAt = args.deletedAt;
  }

  public static fromJson(doc: Record<string, any>): FileModel {
    return new FileModel({
      id: doc["id"],
      name: doc["name"],
      publicUrl: doc["public_url"],
      createdAt: DateTime.fromISO(doc["created_at"]),
      updatedAt: DateTime.fromISO(doc["updated_at"]),
      deletedAt: doc["deleted_at"] && DateTime.fromISO(doc["deleted_at"])
    });
  }

  toEntity(): FileEntity {
    return new FileEntity({
      id: this.id,
      name: this.name,
      publicUrl: this.publicUrl,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt
    });
  }
}
