import { AbstractEntity } from "@/core/resources/entity";

interface InvoiceSummaryEntityConstructor {
  unpaidAmount: number;
  unpaidCount: number;
  totalCount: number;
  paidCount: number;
  overdueAmount: number;
  overdueCount: number;
}

export class InvoiceSummaryEntity implements AbstractEntity {
  public unpaidAmount: number;
  public unpaidCount: number;
  public totalCount: number;
  public paidCount: number;
  public overdueAmount: number;
  public overdueCount: number;

  constructor(args: InvoiceSummaryEntityConstructor) {
    this.unpaidAmount = args.unpaidAmount;
    this.unpaidCount = args.unpaidCount;
    this.totalCount = args.totalCount;
    this.paidCount = args.paidCount;
    this.overdueAmount = args.overdueAmount;
    this.overdueCount = args.overdueCount;
  }
}
