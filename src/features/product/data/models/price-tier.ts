import { AbstractModel } from "@/core/resources/model";
import { PriceTierEntity } from "@/features/product/domain/entities/price-tier";

type PriceTierModelConstructor = {
  minQty: number;
  unitPrice: number;
};

export class PriceTierModel implements AbstractModel {
  public readonly minQty: number;
  public readonly unitPrice: number;

  constructor(args: PriceTierModelConstructor) {
    this.minQty = args.minQty;
    this.unitPrice = args.unitPrice;
  }

  public static fromJson(data: Record<string, any>): PriceTierModel {
    return new PriceTierModel({
      minQty: data["min_qty"] ?? 0,
      unitPrice: data["unit_price"] ?? 0,
    });
  }

  public toEntity(): PriceTierEntity {
    return new PriceTierEntity({
      minQty: this.minQty,
      unitPrice: this.unitPrice,
    });
  }
}
