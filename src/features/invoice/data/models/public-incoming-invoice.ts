import { AbstractModel } from "@/core/resources/model";
import { DateTime } from "luxon";
import { PublicIncomingInvoiceEntity } from "@/features/invoice/domain/entities/public-incoming-invoice";

interface PublicIncomingInvoiceModelConstructor {
  id: string;
  payer: { name: string; address: string };
  supplier: { name: string; email: string; phone: string };
  supplierBank: { accountNumber: string; accountHolderName: string; bankName: string };
  amount: number;
  netAmount: number;
  paidAt: DateTime;
  documents: Array<{
    invoiceNumber?: string;
    invoiceDate: DateTime;
    dueDate: DateTime;
    amount: number;
  }>;
}

export class PublicIncomingInvoiceModel implements AbstractModel {
  public id: string;
  public payer: { name: string; address: string };
  public supplier: { name: string; email: string; phone: string };
  public supplierBank: { accountNumber: string; accountHolderName: string; bankName: string };
  public amount: number;
  public netAmount: number;
  public paidAt: DateTime;
  public documents: Array<{
    invoiceNumber?: string;
    invoiceDate: DateTime;
    dueDate: DateTime;
    amount: number;
  }>;

  constructor(args: PublicIncomingInvoiceModelConstructor) {
    this.id = args.id;
    this.payer = args.payer;
    this.supplier = args.supplier;
    this.supplierBank = args.supplierBank;
    this.amount = args.amount;
    this.netAmount = args.netAmount;
    this.paidAt = args.paidAt;
    this.documents = args.documents;
  }

  public static fromJson(json: Record<string, any>): PublicIncomingInvoiceModel {
    return new PublicIncomingInvoiceModel({
      id: json.id,
      payer: {
        name: json.payer.name,
        address: json.payer.address,
      },
      supplier: {
        name: json.supplier.name,
        email: json.supplier.email,
        phone: json.supplier.phone,
      },
      supplierBank: {
        accountNumber: json.supplier_bank.account_number,
        accountHolderName: json.supplier_bank.account_holder_name,
        bankName: json.supplier_bank.bank_name,
      },
      amount: json.amount,
      netAmount: json.net_amount,
      paidAt: DateTime.fromISO(json.paid_at),
      documents: (json.documents ?? []).map((doc: any) => ({
        invoiceNumber: doc.invoice_number ?? undefined,
        invoiceDate: DateTime.fromISO(doc.invoice_date),
        dueDate: DateTime.fromISO(doc.due_date),
        amount: doc.amount,
      })),
    });
  }

  public toEntity(): PublicIncomingInvoiceEntity {
    return new PublicIncomingInvoiceEntity({
      id: this.id,
      payer: this.payer,
      supplier: this.supplier,
      supplierBank: this.supplierBank,
      amount: this.amount,
      netAmount: this.netAmount,
      paidAt: this.paidAt,
      documents: this.documents,
    });
  }
}
