import { AbstractModel } from "@/core/resources/model";
import { InvoiceSummaryEntity } from "@/features/invoice/domain/entities/invoice-summary";

interface InvoiceSummaryModelConstructor {
  unpaidAmount: number;
  unpaidCount: number;
  totalCount: number;
  paidCount: number;
}

export class InvoiceSummaryModel implements AbstractModel {
  public unpaidAmount: number;
  public unpaidCount: number;
  public totalCount: number;
  public paidCount: number;

  constructor(args: InvoiceSummaryModelConstructor) {
    this.unpaidAmount = args.unpaidAmount;
    this.unpaidCount = args.unpaidCount;
    this.totalCount = args.totalCount;
    this.paidCount = args.paidCount;
  }

  public static fromJson(doc: Record<string, any>): InvoiceSummaryModel {
    return new InvoiceSummaryModel({
      unpaidAmount: doc["unpaid"]["amount"],
      unpaidCount: doc["unpaid"]["count"],
      totalCount: doc["total"]["count"],
      paidCount: doc["paid"]["count"],
    });
  }

  public toEntity(): InvoiceSummaryEntity {
    return new InvoiceSummaryEntity({
      unpaidAmount: this.unpaidAmount,
      unpaidCount: this.unpaidCount,
      totalCount: this.totalCount,
      paidCount: this.paidCount,
    });
  }
}
