import { AbstractEntity } from "@/core/resources/entity";
import { DEFAULT_VARIANT_NAME } from "@/features/product/domain/constants/default-variant";
import { ProductEntity } from "@/features/product/domain/entities/product";
import { PriceTierScheduleEntity } from "@/features/product/domain/entities/price-tier-schedule";

type VariantEntityConstructor = {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  metadata: { hasRecipe?: boolean } | null;
  product: ProductEntity | null;
  priceTierSchedule: PriceTierScheduleEntity | null;
};

export class VariantEntity implements AbstractEntity {
  public id: string;
  public name: string;
  public sku: string | null;
  public price: number;
  public metadata: { hasRecipe?: boolean } | null;
  public product: ProductEntity | null;
  /**
   * `null` means the endpoint did not hydrate a schedule — render nothing at all, not an
   * "no tiers configured" state. A non-null schedule with no tiers means flat-priced.
   * The mode lives inside the schedule precisely so it cannot be read without first
   * narrowing this null.
   */
  public readonly priceTierSchedule: PriceTierScheduleEntity | null;

  constructor(args: VariantEntityConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.sku = args.sku;
    this.price = args.price;
    this.metadata = args.metadata;
    this.product = args.product;
    this.priceTierSchedule = args.priceTierSchedule;
  }

  public get isDefault(): boolean {
    return this.name === DEFAULT_VARIANT_NAME;
  }

  public get productName(): string | null {
    return this.product?.name ?? null;
  }

  public get productId(): string | null {
    return this.product?.id ?? null;
  }
}
