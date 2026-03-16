import { AbstractEntity } from "@/core/resources/entity";

type ProductPhotoEntityConstructor = {
  id: string;
  sortOrder: number;
  publicUrl: string;
};

export class ProductPhotoEntity implements AbstractEntity {
  public id: string;
  public sortOrder: number;
  public publicUrl: string;

  constructor(args: ProductPhotoEntityConstructor) {
    this.id = args.id;
    this.sortOrder = args.sortOrder;
    this.publicUrl = args.publicUrl;
  }
}
