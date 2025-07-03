import { AbstractEntity } from "@/core/resources/entity";
import { DateTime } from "luxon";

interface PublicOutgoingInvoiceEntityConstructor {
  id: string;
  sender: { name: string };
  recipient: { name: string };
  summary: { total: number };
  dueDate: DateTime;
  createdAt: DateTime;
}

export class PublicOutgoingInvoiceEntity implements AbstractEntity {
  public id: string;
  public sender: { name: string };
  public recipient: { name: string };
  public summary: { total: number };
  public dueDate: DateTime;
  public createdAt: DateTime;

  constructor(args: PublicOutgoingInvoiceEntityConstructor) {
    this.id = args.id;
    this.sender = args.sender;
    this.recipient = args.recipient;
    this.summary = args.summary;
    this.dueDate = args.dueDate;
    this.createdAt = args.createdAt;
  }
}
