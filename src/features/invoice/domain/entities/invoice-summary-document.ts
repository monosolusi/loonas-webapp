import {DateTime} from "luxon";
import {AbstractEntity} from "@/core/resources/entity";

interface InvoiceSummaryDocumentEntityConstructor {
  id: string;
  invoiceNumber?: string;
  amount: number;
  dueDate: DateTime;
  invoiceDate: DateTime;
  note?: string;
}

export class InvoiceSummaryDocumentEntity implements AbstractEntity {
  public id: string;
  public invoiceNumber?: string;
  public amount: number;
  public dueDate: DateTime;
  public invoiceDate: DateTime;
  public note?: string;

  constructor(args: InvoiceSummaryDocumentEntityConstructor) {
    this.id = args.id;
    this.invoiceNumber = args.invoiceNumber;
    this.amount = args.amount;
    this.dueDate = args.dueDate;
    this.invoiceDate = args.invoiceDate;
    this.note = args.note;
  }
}
