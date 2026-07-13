import { AbstractEntity } from "@/core/resources/entity";

// GET /dashboard `sales_breakdown` — all outgoing channels (POS + B2B invoice) on an accrual basis.
// Fixed order [CASH, QRIS, VIRTUAL_ACCOUNT, CREDIT_CARD, UNPAID]; CREDIT_CARD collapses the 4 card
// variants; UNPAID = billed/accrued but not yet paid. sum(amount) === revenue.amount for the window.
export type PaymentMethod = "CASH" | "QRIS" | "VIRTUAL_ACCOUNT" | "CREDIT_CARD" | "UNPAID";

export class PaymentMethodBreakdown implements AbstractEntity {
  constructor(
    public readonly method: PaymentMethod,
    public readonly amount: number,
    public readonly transactionCount: number,
  ) {}
}
