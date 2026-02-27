import { AbstractEntity } from "@/core/resources/entity";

interface InvoiceSummaryEntityConstructor {
  unpaidAmount: number;
  unpaidCount: number;
  totalCount: number;
  paidCount: number;
}

export class InvoiceSummaryEntity implements AbstractEntity {
  public unpaidAmount: number;
  public unpaidCount: number;
  public totalCount: number;
  public paidCount: number;

  constructor(args: InvoiceSummaryEntityConstructor) {
    this.unpaidAmount = args.unpaidAmount;
    this.unpaidCount = args.unpaidCount;
    this.totalCount = args.totalCount;
    this.paidCount = args.paidCount;
  }
}
