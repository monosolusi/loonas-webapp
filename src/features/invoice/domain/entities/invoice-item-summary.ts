import { AbstractEntity } from "@/core/resources/entity";

interface InvoiceItemSummaryEntityConstructor {
  amountBeforeTax: number;
  taxBase: number;
  totalTax: number;
  totalNonTaxable: number;
  total: number;
}

export class InvoiceItemSummaryEntity implements AbstractEntity {
  public amountBeforeTax: number;
  public taxBase: number;
  public totalTax: number;
  public totalNonTaxable: number;
  public total: number;

  constructor(args: InvoiceItemSummaryEntityConstructor) {
    this.amountBeforeTax = args.amountBeforeTax;
    this.taxBase = args.taxBase;
    this.totalTax = args.totalTax;
    this.totalNonTaxable = args.totalNonTaxable;
    this.total = args.total;
  }
}
