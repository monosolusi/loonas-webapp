import { AbstractModel } from "@/core/resources/model";
import { PaymentMethod, PaymentMethodBreakdown } from "@/features/dashboard/domain/entities/payment-method-breakdown";

export class PaymentMethodBreakdownModel implements AbstractModel {
  constructor(
    public readonly method: PaymentMethod,
    public readonly amount: number,
    public readonly transactionCount: number,
  ) {}

  public static fromJson(doc: Record<string, any>): PaymentMethodBreakdownModel {
    return new PaymentMethodBreakdownModel(
      doc["payment_method"] as PaymentMethod,
      doc["amount"] ?? 0,
      doc["transaction_count"] ?? 0,
    );
  }

  public toEntity(): PaymentMethodBreakdown {
    return new PaymentMethodBreakdown(this.method, this.amount, this.transactionCount);
  }
}
