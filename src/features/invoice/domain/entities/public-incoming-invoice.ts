import { AbstractEntity } from "@/core/resources/entity";
import { DateTime } from "luxon";

interface PublicIncomingInvoiceDocumentConstructor {
  invoiceNumber?: string;
  invoiceDate: DateTime;
  dueDate: DateTime;
  amount: number;
}

interface PublicIncomingInvoiceEntityConstructor {
  id: string;
  payer: { name: string; address: string };
  supplier: { name: string; email: string; phone: string };
  supplierBank: { accountNumber: string; accountHolderName: string; bankName: string };
  amount: number;
  netAmount: number;
  paidAt: DateTime;
  documents: PublicIncomingInvoiceDocumentConstructor[];
}

export class PublicIncomingInvoiceDocumentEntity {
  public invoiceNumber?: string;
  public invoiceDate: DateTime;
  public dueDate: DateTime;
  public amount: number;

  constructor(args: PublicIncomingInvoiceDocumentConstructor) {
    this.invoiceNumber = args.invoiceNumber;
    this.invoiceDate = args.invoiceDate;
    this.dueDate = args.dueDate;
    this.amount = args.amount;
  }
}

export class PublicIncomingInvoiceEntity implements AbstractEntity {
  public id: string;
  public payer: { name: string; address: string };
  public supplier: { name: string; email: string; phone: string };
  public supplierBank: { accountNumber: string; accountHolderName: string; bankName: string };
  public amount: number;
  public netAmount: number;
  public paidAt: DateTime;
  public documents: PublicIncomingInvoiceDocumentEntity[];

  constructor(args: PublicIncomingInvoiceEntityConstructor) {
    this.id = args.id;
    this.payer = args.payer;
    this.supplier = args.supplier;
    this.supplierBank = args.supplierBank;
    this.amount = args.amount;
    this.netAmount = args.netAmount;
    this.paidAt = args.paidAt;
    this.documents = args.documents.map((d) => new PublicIncomingInvoiceDocumentEntity(d));
  }
}
