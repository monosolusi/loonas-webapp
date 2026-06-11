import { AbstractModel } from "@/core/resources/model";
import { FundRecipientType } from "@/features/invoice/domain/enums/fund-recipient-type";
import { InvoiceFundRecipientEntity } from "@/features/invoice/domain/entities/invoice-fund-recipient";

type InvoiceFundRecipientModelConstructor = {
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

function parseRecipientType(raw: unknown): FundRecipientType {
  if (typeof raw === "string" && (Object.values(FundRecipientType) as string[]).includes(raw)) {
    return raw as FundRecipientType;
  }
  return FundRecipientType.ACCOUNT_PERSONAL;
}

export class InvoiceFundRecipientModel implements AbstractModel {
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

  constructor(args: InvoiceFundRecipientModelConstructor) {
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

  public static fromJson(doc: Record<string, any>): InvoiceFundRecipientModel {
    return new InvoiceFundRecipientModel({
      id: doc["id"] ?? "",
      recipientType: parseRecipientType(doc["recipient_type"]),
      recipientId: doc["recipient_id"] ?? "",
      fullName: doc["full_name"] ?? "",
      fullAddress: typeof doc["full_address"] === "string" ? doc["full_address"] : null,
      phoneNumber: typeof doc["phone_number"] === "string" ? doc["phone_number"] : null,
      email: typeof doc["email"] === "string" ? doc["email"] : null,
      bankId: doc["bank_id"] ?? "",
      bankName: doc["bank_name"] ?? "",
      bankCode: doc["bank_code"] ?? "",
      bankAccountNumber: doc["bank_account_number"] ?? "",
      bankAccountHolderName: doc["bank_account_holder_name"] ?? "",
    });
  }

  public toEntity(): InvoiceFundRecipientEntity {
    return new InvoiceFundRecipientEntity({
      id: this.id,
      recipientType: this.recipientType,
      recipientId: this.recipientId,
      fullName: this.fullName,
      fullAddress: this.fullAddress,
      phoneNumber: this.phoneNumber,
      email: this.email,
      bankId: this.bankId,
      bankName: this.bankName,
      bankCode: this.bankCode,
      bankAccountNumber: this.bankAccountNumber,
      bankAccountHolderName: this.bankAccountHolderName,
    });
  }
}
