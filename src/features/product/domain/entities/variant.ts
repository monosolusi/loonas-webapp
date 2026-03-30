import { AbstractEntity } from "@/core/resources/entity";
import { DEFAULT_VARIANT_NAME } from "@/features/product/domain/constants/default-variant";

type VariantEntityConstructor = {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  metadata: { hasRecipe?: boolean } | null;
};

export class VariantEntity implements AbstractEntity {
  public id: string;
  public name: string;
  public sku: string | null;
  public price: number;
  public metadata: { hasRecipe?: boolean } | null;

  constructor(args: VariantEntityConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.sku = args.sku;
    this.price = args.price;
    this.metadata = args.metadata;
  }

  public get isDefault(): boolean {
    return this.name === DEFAULT_VARIANT_NAME;
  }
}
