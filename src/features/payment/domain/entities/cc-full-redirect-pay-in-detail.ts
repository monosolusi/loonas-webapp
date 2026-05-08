import { DateTime } from "luxon";
import { PayInStatus } from "@/features/invoice/domain/enums/pay-in-status";
import { AbstractEntity } from "@/core/resources/entity";

interface CreditCardFullRedirectPayInDetailEntityConstructor {
  id: string;
  redirectUrl: string;
  providerId: string;
  providerName: string;
  status: PayInStatus;
  amount: number;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export class CreditCardFullRedirectPayInDetailEntity implements AbstractEntity {
  public id: string;
  public redirectUrl: string;
  public providerId: string;
  public providerName: string;
  public status: PayInStatus;
  public amount: number;
  public createdAt: DateTime;
  public updatedAt: DateTime;

  constructor(args: CreditCardFullRedirectPayInDetailEntityConstructor) {
    this.id = args.id;
    this.redirectUrl = args.redirectUrl;
    this.providerId = args.providerId;
    this.providerName = args.providerName;
    this.status = args.status;
    this.amount = args.amount;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }
}
