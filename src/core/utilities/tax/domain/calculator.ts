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
    if (!params.taxType) return 0; // This is the case where it is not taxable
    if (params.taxType === TaxType.EXCLUSIVE) return Math.floor(params.base);
    else if (params.taxType === TaxType.INCLUSIVE) return Math.floor(params.base - (params.tax ?? 0));
    else if (params.taxType === TaxType.SPECIAL_DPP_11_12_EXCLUSIVE) return Math.floor(params.base * (11 / 12));
    else if (params.taxType === TaxType.NON_TAXABLE) return 0;
    else return 0;
  }

  public static calculateTotalWithTax(params: CalculateTotalWithTaxParams) {
    if (params.taxType === TaxType.NON_TAXABLE) return params.base;
    if (params.taxType === TaxType.EXCLUSIVE) return params.base + params.tax;
    if (params.taxType === TaxType.INCLUSIVE) return params.base;
    if (params.taxType === TaxType.SPECIAL_DPP_11_12_EXCLUSIVE) return params.base + params.tax;
    else return 0;
  }
}
