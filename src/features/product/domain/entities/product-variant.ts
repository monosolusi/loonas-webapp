import { AbstractEntity } from "@/core/resources/entity";

type ProductVariantEntityConstructor = {
  id: string;
  name: string;
  sku: string | null;
  price: number;
};

export class ProductVariantEntity implements AbstractEntity {
  public id: string;
  public name: string;
  public sku: string | null;
  public price: number;

  constructor(args: ProductVariantEntityConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.sku = args.sku;
    this.price = args.price;
  }

  public get isDefault(): boolean {
    return this.name === "Default";
  }
}
