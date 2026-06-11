import { AbstractModel } from "@/core/resources/model";
import { InvoiceSummaryEntity } from "@/features/invoice/domain/entities/invoice-summary";

interface InvoiceSummaryModelConstructor {
  unpaidAmount: number;
  unpaidCount: number;
  waitingSettlementAmount: number;
  waitingSettlementCount: number;
  totalCount: number;
  paidCount: number;
  overdueAmount: number;
  overdueCount: number;
}

export class InvoiceSummaryModel implements AbstractModel {
  public unpaidAmount: number;
  public unpaidCount: number;
  public waitingSettlementAmount: number;
  public waitingSettlementCount: number;
  public totalCount: number;
  public paidCount: number;
  public overdueAmount: number;
  public overdueCount: number;

  constructor(args: InvoiceSummaryModelConstructor) {
    this.unpaidAmount = args.unpaidAmount;
    this.unpaidCount = args.unpaidCount;
    this.waitingSettlementAmount = args.waitingSettlementAmount;
    this.waitingSettlementCount = args.waitingSettlementCount;
    this.totalCount = args.totalCount;
    this.paidCount = args.paidCount;
    this.overdueAmount = args.overdueAmount;
    this.overdueCount = args.overdueCount;
  }

  public static fromJson(doc: Record<string, any>): InvoiceSummaryModel {
    return new InvoiceSummaryModel({
      unpaidAmount: doc["unpaid"]["amount"],
      unpaidCount: doc["unpaid"]["count"],
      waitingSettlementAmount: doc["waiting_settlement"]?.["amount"] ?? 0,
      waitingSettlementCount: doc["waiting_settlement"]?.["count"] ?? 0,
      totalCount: doc["total"]["count"],
      paidCount: doc["paid"]["count"],
      overdueAmount: doc["overdue"]?.["amount"] ?? 0,
      overdueCount: doc["overdue"]?.["count"] ?? 0,
    });
  }

  public toEntity(): InvoiceSummaryEntity {
    return new InvoiceSummaryEntity({
      unpaidAmount: this.unpaidAmount,
      unpaidCount: this.unpaidCount,
      waitingSettlementAmount: this.waitingSettlementAmount,
      waitingSettlementCount: this.waitingSettlementCount,
      totalCount: this.totalCount,
      paidCount: this.paidCount,
      overdueAmount: this.overdueAmount,
      overdueCount: this.overdueCount,
    });
  }
}
