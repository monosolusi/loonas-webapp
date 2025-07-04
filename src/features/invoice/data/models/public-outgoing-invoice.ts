import { AbstractModel } from "@/core/resources/model";
import { DateTime } from "luxon";
import { PublicOutgoingInvoiceEntity } from "../../domain/entities/public-outgoing-invoice";

interface PublicOutgoingInvoiceModelConstructor {
  id: string;
  sender: { name: string };
  recipient: { name: string };
  summary: { total: number };
  dueDate: DateTime;
  createdAt: DateTime;
}

export class PublicOutgoingInvoiceModel implements AbstractModel {
  public id: string;
  public sender: { name: string };
  public recipient: { name: string };
  public summary: { total: number };
  public dueDate: DateTime;
  public createdAt: DateTime;

  constructor(args: PublicOutgoingInvoiceModelConstructor) {
    this.id = args.id;
    this.sender = args.sender;
    this.recipient = args.recipient;
    this.summary = args.summary;
    this.dueDate = args.dueDate;
    this.createdAt = args.createdAt;
  }

  public static fromJson(json: Record<string, any>): PublicOutgoingInvoiceModel {
    return new PublicOutgoingInvoiceModel({
      id: json.id,
      sender: { name: json.sender.name },
      recipient: { name: json.recipient.name },
      summary: { total: json.summary.total },
      dueDate: DateTime.fromISO(json.due_date),
      createdAt: DateTime.fromISO(json.created_at),
    });
  }

  public toEntity(): PublicOutgoingInvoiceEntity {
    return new PublicOutgoingInvoiceEntity({
      id: this.id,
      sender: this.sender,
      recipient: this.recipient,
      summary: this.summary,
      dueDate: this.dueDate,
      createdAt: this.createdAt,
    });
  }
}
