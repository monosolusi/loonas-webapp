import { AbstractEntity } from "@/core/resources/entity";

type PriceTierEntityConstructor = {
  minQty: number;
  unitPrice: number;
};

/**
 * One quantity break in a variant's grosir schedule.
 *
 * `minQty` is strictly greater than 1 and may be fractional (1.5 is valid, for
 * weight-sold goods). `unitPrice` is whole rupiah, never minor units.
 */
export class PriceTierEntity implements AbstractEntity {
  public readonly minQty: number;
  public readonly unitPrice: number;

  constructor(args: PriceTierEntityConstructor) {
    this.minQty = args.minQty;
    this.unitPrice = args.unitPrice;
  }
}
