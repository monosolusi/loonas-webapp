import { DateTime } from "luxon";
import { AbstractEntity } from "@/core/resources/entity";

interface InvoiceSummaryDocumentEntityConstructor {
  id: string;
  invoiceNumber?: string;
  amount: number;
  dueDate: DateTime;
}

export class InvoiceSummaryDocumentEntity implements AbstractEntity {
  public id: string;
  public invoiceNumber?: string;
  public amount: number;
  public dueDate: DateTime;

  constructor(args: InvoiceSummaryDocumentEntityConstructor) {
    this.id = args.id;
    this.invoiceNumber = args.invoiceNumber;
    this.amount = args.amount;
    this.dueDate = args.dueDate;
  }
}