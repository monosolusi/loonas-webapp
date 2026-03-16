import { DateTime } from "luxon";
import { FileEntity } from "@/features/file/domain/entities/file";

type ProductPhotoEntityConstructor = {
  id: string;
  name?: string;
  publicUrl: string;
  sortOrder: number;
  createdAt?: DateTime;
  updatedAt?: DateTime;
};

export class ProductPhotoEntity extends FileEntity {
  public sortOrder: number;

  constructor(args: ProductPhotoEntityConstructor) {
    super({
      id: args.id,
      name: args.name ?? "",
      publicUrl: args.publicUrl,
      createdAt: args.createdAt ?? DateTime.now(),
      updatedAt: args.updatedAt ?? DateTime.now(),
    });
    this.sortOrder = args.sortOrder;
  }
}
