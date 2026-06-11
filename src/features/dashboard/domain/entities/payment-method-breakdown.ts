import { AbstractEntity } from "@/core/resources/entity";

export class PaymentMethodBreakdown implements AbstractEntity {
  constructor(
    public readonly method: "CASH" | "QRIS",
    public readonly amount: number,
    public readonly transactionCount: number,
  ) {}
}
