import { AbstractEntity } from "@/core/resources/entity";

// GET /dashboard `expense_breakdown` — accrual operating expense split by category for the window.
// Fixed order [cost_of_goods_sold, operating_expenses, other_expenses]. Disjoint from `expense.tax`
// (PPh Final), which is surfaced as a separate field, not a breakdown category. sum(amount) === expense.amount.
export type ExpenseCategory = "cost_of_goods_sold" | "operating_expenses" | "other_expenses";

export class ExpenseBreakdown implements AbstractEntity {
  constructor(
    public readonly category: ExpenseCategory,
    public readonly amount: number,
  ) {}
}
