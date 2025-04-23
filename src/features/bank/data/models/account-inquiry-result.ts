import { AccountInquiryResultEntity } from "@/features/bank/domain/entities/account-inquiry-result";

export class AccountInquiryResultModel {
  constructor(
    public accountHolderName: string,
    public accountNumber: string,
    public bic: string
  ) {
  }

  public static fromJson(json: any): AccountInquiryResultModel {
    return new AccountInquiryResultModel(
      json.account_holder_name,
      json.account_number,
      json.bic
    );
  }

  public toEntity(): AccountInquiryResultEntity {
    return new AccountInquiryResultEntity(
      this.accountHolderName,
      this.accountNumber,
      this.bic
    );
  }
}