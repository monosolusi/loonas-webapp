import { DateTime } from "luxon";
import { InvoiceSummaryDocumentEntity } from "@/features/invoice/domain/entities/invoice-summary-document";
import { AbstractModel } from "@/core/resources/model";
import { FileModel } from "@/features/file/data/models/file";

export interface InvoiceSummaryDocumentModelConstructor {
  id: string;
  file?: FileModel;
  invoiceNumber?: string;
  amount: number;
  dueDate: DateTime;
  invoiceDate: DateTime;
  note?: string;
}

export class InvoiceSummaryDocumentModel implements AbstractModel {
  public id: string;
  public file?: FileModel;
  public invoiceNumber?: string;
  public amount: number;
  public dueDate: DateTime;
  public invoiceDate: DateTime;
  public note?: string;

  constructor(args: InvoiceSummaryDocumentModelConstructor) {
    this.id = args.id;
    this.file = args.file;
    this.invoiceNumber = args.invoiceNumber;
    this.amount = args.amount;
    this.dueDate = args.dueDate;
    this.invoiceDate = args.invoiceDate;
    this.note = args.note;
  }

  public static fromJson(json: any): InvoiceSummaryDocumentModel {
    return new InvoiceSummaryDocumentModel({
      id: json.id,
      file: json.file && FileModel.fromJson(json.file),
      invoiceNumber: json.invoice_number,
      amount: json.amount,
      dueDate: DateTime.fromISO(json.due_date),
      invoiceDate: DateTime.fromISO(json.invoice_date),
      note: json.note
    });
  }

  public toEntity(): InvoiceSummaryDocumentEntity {
    return new InvoiceSummaryDocumentEntity({
      id: this.id,
      file: this.file?.toEntity(),
      invoiceNumber: this.invoiceNumber,
      amount: this.amount,
      dueDate: this.dueDate,
      invoiceDate: this.invoiceDate,
      note: this.note
    });
  }

}
