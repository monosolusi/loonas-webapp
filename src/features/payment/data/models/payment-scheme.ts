import { AbstractModel } from "@/core/resources/model";
import { PaymentSchemeEntity } from "../../domain/entities/payment-scheme";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

interface PaymentSchemeModelConstructor {
  id: string;
  name: string;
  logoUrl: string;
  isActive: boolean;
}

export class PaymentSchemeModel implements AbstractModel {
  public id: string;
  public name: string;
  public logoUrl: string;
  public isActive: boolean;

  constructor(args: PaymentSchemeModelConstructor) {
    this.id = args.id;
    this.name = args.name;
    this.logoUrl = args.logoUrl;
    this.isActive = args.isActive;
  }

  public static fromJson(json: Record<string, any>): PaymentSchemeModel {
    if (!json) throw new ServerError(ErrorCodes.EMPTY_RESPONSE);
    return new PaymentSchemeModel({
      id: json["id"],
      name: json["name"],
      logoUrl: json["logo_url"],
      isActive: json["is_active"],
    });
  }

  toEntity(): PaymentSchemeEntity {
    return new PaymentSchemeEntity(this.id, this.name, this.logoUrl, this.isActive);
  }
}
