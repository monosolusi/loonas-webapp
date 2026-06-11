import { AbstractEntity } from "@/core/resources/entity";

interface InvoiceSummaryEntityConstructor {
  unpaidAmount: number;
  unpaidCount: number;
  waitingSettlementAmount: number;
  waitingSettlementCount: number;
  totalCount: number;
  paidCount: number;
  overdueAmount: number;
  overdueCount: number;
}

export class InvoiceSummaryEntity implements AbstractEntity {
  public unpaidAmount: number;
  public unpaidCount: number;
  public waitingSettlementAmount: number;
  public waitingSettlementCount: number;
  public totalCount: number;
  public paidCount: number;
  public overdueAmount: number;
  public overdueCount: number;

  constructor(args: InvoiceSummaryEntityConstructor) {
    this.unpaidAmount = args.unpaidAmount;
    this.unpaidCount = args.unpaidCount;
    this.waitingSettlementAmount = args.waitingSettlementAmount;
    this.waitingSettlementCount = args.waitingSettlementCount;
    this.totalCount = args.totalCount;
    this.paidCount = args.paidCount;
    this.overdueAmount = args.overdueAmount;
    this.overdueCount = args.overdueCount;
  }
}
