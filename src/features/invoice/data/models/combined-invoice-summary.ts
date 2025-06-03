import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { InvoiceStatus } from "@/features/invoice/domain/entities/invoice";
import { DateTime } from "luxon";
import { AbstractModel } from "@/core/resources/model";
import { CombinedInvoiceSummaryEntity } from "@/features/invoice/domain/entities/combined-invoice-summary";

interface CombinedInvoiceSummaryModelConstructor {
  id: string;
  type: InvoiceType;
  partnerId: string;
  partnerName: string;
  status: InvoiceStatus;
  total: number;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export class CombinedInvoiceSummaryModel implements AbstractModel {
  public id: string;
  public type: InvoiceType;
  public partnerId: string;
  public partnerName: string;
  public status: InvoiceStatus;
  public total: number;
  public createdAt: DateTime;
  public updatedAt: DateTime;

  constructor(args: CombinedInvoiceSummaryModelConstructor) {
    this.id = args.id;
    this.type = args.type;
    this.partnerId = args.partnerId;
    this.partnerName = args.partnerName;
    this.status = args.status;
    this.total = args.total;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  public static fromJson(json: Record<string, any>): CombinedInvoiceSummaryModel {
    return new CombinedInvoiceSummaryModel({
      id: json["id"],
      type: json["type"],
      partnerId: json["partner_id"],
      partnerName: json["partner_name"],
      status: json["status"],
      total: json["total"],
      createdAt: DateTime.fromISO(json["created_at"]),
      updatedAt: DateTime.fromISO(json["updated_at"]),
    });
  }

  toEntity(): CombinedInvoiceSummaryEntity {
    return new CombinedInvoiceSummaryEntity({
      id: this.id,
      type: this.type,
      partnerId: this.partnerId,
      partnerName: this.partnerName,
      status: this.status,
      total: this.total,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    });
  }
}
