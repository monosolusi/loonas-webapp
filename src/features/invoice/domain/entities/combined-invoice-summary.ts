import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { InvoiceStatus } from "@/features/invoice/domain/entities/invoice";
import { DateTime } from "luxon";
import { AbstractEntity } from "@/core/resources/entity";

interface CombinedInvoiceSummaryEntityConstructor {
  id: string;
  type: InvoiceType;
  partnerId: string;
  partnerName: string;
  status: InvoiceStatus;
  total: number;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export class CombinedInvoiceSummaryEntity implements AbstractEntity {
  public id: string;
  public type: InvoiceType;
  public partnerId: string;
  public partnerName: string;
  public status: InvoiceStatus;
  public total: number;
  public createdAt: DateTime;
  public updatedAt: DateTime;

  constructor(args: CombinedInvoiceSummaryEntityConstructor) {
    this.id = args.id;
    this.type = args.type;
    this.partnerId = args.partnerId;
    this.partnerName = args.partnerName;
    this.status = args.status;
    this.total = args.total;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }
}
