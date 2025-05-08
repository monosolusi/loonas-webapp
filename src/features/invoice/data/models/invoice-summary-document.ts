import { DateTime } from "luxon";
import { InvoiceSummaryDocumentEntity } from "@/features/invoice/domain/entities/invoice-summary-document";
import { AbstractModel } from "@/core/resources/model";

export interface InvoiceSummaryDocumentModelConstructor {
  id: string;
  invoiceNumber?: string;
  amount: number;
  dueDate: DateTime;
}

export class InvoiceSummaryDocumentModel implements AbstractModel {
  public id: string;
  public invoiceNumber?: string;
  public amount: number;
  public dueDate: DateTime;

  constructor(args: InvoiceSummaryDocumentModelConstructor) {
    this.id = args.id;
    this.invoiceNumber = args.invoiceNumber;
    this.amount = args.amount;
    this.dueDate = args.dueDate;
  }

  public static fromJson(json: any): InvoiceSummaryDocumentModel {
    return new InvoiceSummaryDocumentModel({
      id: json.id,
      invoiceNumber: json.invoice_number,
      amount: json.amount,
      dueDate: DateTime.fromISO(json.due_date)
    });
  }

  public toEntity(): InvoiceSummaryDocumentEntity {
    return new InvoiceSummaryDocumentEntity({
      id: this.id,
      invoiceNumber: this.invoiceNumber,
      amount: this.amount,
      dueDate: this.dueDate
    });
  }

}