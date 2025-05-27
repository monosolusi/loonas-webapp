import {
  DiscountType,
  TaxType
} from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";

interface CalculateTaxBaseParams {
  base: number;
  taxType?: TaxType;
  tax?: number;
}

interface CalculateBaseParams {
  price: number;
  qty: number;
  discountType?: DiscountType;
  discount?: number;
}

interface CalculateTotalWithTaxParams {
  taxType: TaxType;
  tax: number;
  taxBase: number;
  base: number;
}

export class TaxCalculator {
  public static calculateAmountBeforeTax(params: CalculateBaseParams) {
    if (!params.discountType || !params.discount || params.discountType === DiscountType.NO_DISCOUNT) return params.price * params.qty;
    if (params.discountType === DiscountType.PERCENTAGE) {
      return params.price * params.qty * (100 - params.discount) / 100;
    } else if (params.discountType === DiscountType.FIXED) {
      return params.price * params.qty - params.discount;
    } else return params.price * params.qty;
  }

  public static calculateTaxBase(params: CalculateTaxBaseParams) {
    if (!params.taxType || !params.tax) return 0; // This is the case where it is not taxable
    if (params.taxType === TaxType.EXCLUSIVE) return params.base;
    else if (params.taxType === TaxType.INCLUSIVE) return params.base - params.tax;
    else return 0;
  }

  public static calculateTotalWithTax(params: CalculateTotalWithTaxParams) {
    if (params.taxType === TaxType.NON_TAXABLE) return params.base;
    else return params.taxBase + params.tax;
  }
}
