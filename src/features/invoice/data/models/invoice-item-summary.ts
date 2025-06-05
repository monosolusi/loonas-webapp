import { AbstractModel } from "@/core/resources/model";
import { InvoiceItemSummaryEntity } from "@/features/invoice/domain/entities/invoice-item-summary";

interface InvoiceItemSummaryModelConstructor {
  amountBeforeTax: number;
  taxBase: number;
  totalTax: number;
  totalNonTaxable: number;
  total: number;
}

export class InvoiceItemSummaryModel implements AbstractModel {
  public amountBeforeTax: number;
  public taxBase: number;
  public totalTax: number;
  public totalNonTaxable: number;
  public total: number;

  constructor(args: InvoiceItemSummaryModelConstructor) {
    this.amountBeforeTax = args.amountBeforeTax;
    this.taxBase = args.taxBase;
    this.totalTax = args.totalTax;
    this.totalNonTaxable = args.totalNonTaxable;
    this.total = args.total;
  }

  public static fromJson(data: Record<string, any>): InvoiceItemSummaryModel {
    return new InvoiceItemSummaryModel({
      amountBeforeTax: Number(data.amount_before_tax),
      taxBase: Number(data.tax_base),
      totalTax: Number(data.total_tax),
      totalNonTaxable: Number(data.total_non_taxable),
      total: Number(data.total),
    });
  }

  toEntity(): InvoiceItemSummaryEntity {
    return new InvoiceItemSummaryEntity({
      amountBeforeTax: this.amountBeforeTax,
      taxBase: this.taxBase,
      totalTax: this.totalTax,
      totalNonTaxable: this.totalNonTaxable,
      total: this.total,
    });
  }
}
