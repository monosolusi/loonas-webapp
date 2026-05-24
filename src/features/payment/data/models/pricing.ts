import { AbstractModel } from "@/core/resources/model";
import { PricingEntity } from "@/features/payment/domain/entities/pricing";

interface PricingModelConstructor {
  baseFee: number;
  percentageFee: number;
}

export class PricingModel implements AbstractModel {
  public baseFee: number;
  public percentageFee: number;

  constructor(args: PricingModelConstructor) {
    this.baseFee = args.baseFee;
    this.percentageFee = args.percentageFee;
  }

  public static fromJson(json: Record<string, any> | null | undefined): PricingModel {
    return new PricingModel({
      baseFee: json?.["base_fee"] ?? 0,
      percentageFee: json?.["percentage_fee"] ?? 0
    });
  }

  toEntity(): PricingEntity {
    return new PricingEntity(
      this.baseFee,
      this.percentageFee
    );
  }
}