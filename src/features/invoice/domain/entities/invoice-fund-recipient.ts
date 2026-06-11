import { AbstractEntity } from "@/core/resources/entity";
import { FundRecipientType } from "@/features/invoice/domain/enums/fund-recipient-type";

type InvoiceFundRecipientEntityConstructor = {
  id: string;
  recipientType: FundRecipientType;
  recipientId: string;
  fullName: string;
  fullAddress: string | null;
  phoneNumber: string | null;
  email: string | null;
  bankId: string;
  bankName: string;
  bankCode: string;
  bankAccountNumber: string;
  bankAccountHolderName: string;
};

export class InvoiceFundRecipientEntity implements AbstractEntity {
  public readonly id: string;
  public readonly recipientType: FundRecipientType;
  public readonly recipientId: string;
  public readonly fullName: string;
  public readonly fullAddress: string | null;
  public readonly phoneNumber: string | null;
  public readonly email: string | null;
  public readonly bankId: string;
  public readonly bankName: string;
  public readonly bankCode: string;
  public readonly bankAccountNumber: string;
  public readonly bankAccountHolderName: string;

  constructor(args: InvoiceFundRecipientEntityConstructor) {
    this.id = args.id;
    this.recipientType = args.recipientType;
    this.recipientId = args.recipientId;
    this.fullName = args.fullName;
    this.fullAddress = args.fullAddress;
    this.phoneNumber = args.phoneNumber;
    this.email = args.email;
    this.bankId = args.bankId;
    this.bankName = args.bankName;
    this.bankCode = args.bankCode;
    this.bankAccountNumber = args.bankAccountNumber;
    this.bankAccountHolderName = args.bankAccountHolderName;
  }
}
