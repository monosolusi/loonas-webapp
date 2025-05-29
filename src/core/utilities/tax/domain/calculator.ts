import { DiscountType } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";

interface CalculateBaseParams {
  price: number;
  qty: number;
  discountType?: DiscountType;
  discount?: number;
}

export class TaxCalculator {
  public static calculateAmountBeforeTax(params: CalculateBaseParams) {
    if (!params.discountType || !params.discount || params.discountType === DiscountType.NO_DISCOUNT)
      return params.price * params.qty;
    if (params.discountType === DiscountType.PERCENTAGE) {
      return (params.price * params.qty * (100 - params.discount)) / 100;
    } else if (params.discountType === DiscountType.FIXED) {
      return params.price * params.qty - params.discount;
    } else return params.price * params.qty;
  }
}
