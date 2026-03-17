import { AbstractEntity } from "@/core/resources/entity";
import { DEFAULT_VARIANT_NAME } from "@/features/product/domain/constants/default-variant";

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
    return this.name === DEFAULT_VARIANT_NAME;
  }
}
