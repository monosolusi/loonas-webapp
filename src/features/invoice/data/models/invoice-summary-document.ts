import {DateTime} from "luxon";
import {InvoiceSummaryDocumentEntity} from "@/features/invoice/domain/entities/invoice-summary-document";
import {AbstractModel} from "@/core/resources/model";

export interface InvoiceSummaryDocumentModelConstructor {
  id: string;
  invoiceNumber?: string;
  amount: number;
  dueDate: DateTime;
  invoiceDate: DateTime;
  note?: string;
}

export class InvoiceSummaryDocumentModel implements AbstractModel {
  public id: string;
  public invoiceNumber?: string;
  public amount: number;
  public dueDate: DateTime;
  public invoiceDate: DateTime;
  public note?: string;

  constructor(args: InvoiceSummaryDocumentModelConstructor) {
    this.id = args.id;
    this.invoiceNumber = args.invoiceNumber;
    this.amount = args.amount;
    this.dueDate = args.dueDate;
    this.invoiceDate = args.invoiceDate;
    this.note = args.note;
  }

  public static fromJson(json: any): InvoiceSummaryDocumentModel {
    return new InvoiceSummaryDocumentModel({
      id: json.id,
      invoiceNumber: json.invoice_number,
      amount: json.amount,
      dueDate: DateTime.fromISO(json.due_date),
      invoiceDate: DateTime.fromISO(json.invoice_date),
      note: json.note,
    });
  }

  public toEntity(): InvoiceSummaryDocumentEntity {
    return new InvoiceSummaryDocumentEntity({
      id: this.id,
      invoiceNumber: this.invoiceNumber,
      amount: this.amount,
      dueDate: this.dueDate,
      invoiceDate: this.invoiceDate,
      note: this.note,
    });
  }

}
