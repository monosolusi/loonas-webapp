import { AbstractEntity } from "@/core/resources/entity";

export class AccountInquiryResultEntity implements AbstractEntity {
  constructor(
    public accountHolderName: string,
    public accountNumber: string,
    public bic: string
  ) {
  }
}