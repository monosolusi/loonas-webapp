import { AbstractEntity } from "@/core/resources/entity";
import { UnavailableReason } from "@/features/product/domain/enums/unavailable-reason";

type VariantForSaleEntityConstructor = {
  id: string;
  name: string;
  sku: string | null;
  price: number;
  isAvailable: boolean;
  unavailableReason: UnavailableReason | null;
  currentStock: number | null;
  maxMakeable: number | null;
};

export class VariantForSaleEntity implements AbstractEntity {
  public readonly id: string;
  public readonly name: string;
  public readonly sku: string | null;
  public readonly price: number;
  public readonly isAvailable: boolean;
  public readonly unavailableReason: UnavailableReason | null;
  public readonly currentStock: number | null;
  public readonly maxMakeable: number | null;

  constructor(args: VariantForSaleEntityConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.sku = args.sku;
    this.price = args.price;
    this.isAvailable = args.isAvailable;
    this.unavailableReason = args.unavailableReason;
    this.currentStock = args.currentStock;
    this.maxMakeable = args.maxMakeable;
  }
}
