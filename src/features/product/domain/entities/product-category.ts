import { AbstractEntity } from "@/core/resources/entity";

type ProductCategoryEntityConstructor = {
  id: string;
  name: string;
};

export class ProductCategoryEntity implements AbstractEntity {
  public id: string;
  public name: string;

  constructor(args: ProductCategoryEntityConstructor) {
    this.id = args.id;
    this.name = args.name;
  }
}
