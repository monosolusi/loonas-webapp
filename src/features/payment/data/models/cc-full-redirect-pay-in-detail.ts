import { AbstractModel } from "@/core/resources/model";
import { PayInStatus } from "@/features/payment/domain/enums/pay-in";
import { DateTime } from "luxon";
import {
  CreditCardFullRedirectPayInDetailEntity
} from "@/features/payment/domain/entities/cc-full-redirect-pay-in-detail";

interface CreditCardFullRedirectPayInDetailModelConstructor {
  id: string;
  redirectUrl: string;
  providerId: string;
  providerName: string;
  status: PayInStatus;
  amount: number;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export class CreditCardFullRedirectPayInDetailModel implements AbstractModel {
  public id: string;
  public redirectUrl: string;
  public providerId: string;
  public providerName: string;
  public status: PayInStatus;
  public amount: number;
  public createdAt: DateTime;
  public updatedAt: DateTime;

  constructor(args: CreditCardFullRedirectPayInDetailModelConstructor) {
    this.id = args.id;
    this.redirectUrl = args.redirectUrl;
    this.providerId = args.providerId;
    this.providerName = args.providerName;
    this.status = args.status;
    this.amount = args.amount;
    this.createdAt = args.createdAt;
    this.updatedAt = args.updatedAt;
  }

  public static fromJson(data: Record<string, any>): CreditCardFullRedirectPayInDetailModel {
    return new CreditCardFullRedirectPayInDetailModel({
      id: data["id"],
      redirectUrl: data["redirect_url"],
      providerId: data["provider_id"],
      providerName: data["provider_name"],
      status: data["status"],
      amount: Number(data["amount"]),
      createdAt: DateTime.fromISO(data["created_at"]),
      updatedAt: DateTime.fromISO(data["updated_at"])
    });
  }

  toEntity(): CreditCardFullRedirectPayInDetailEntity {
    return new CreditCardFullRedirectPayInDetailEntity({
      id: this.id,
      redirectUrl: this.redirectUrl,
      providerId: this.providerId,
      providerName: this.providerName,
      status: this.status,
      amount: this.amount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    });
  }
}
