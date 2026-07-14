import { AbstractEntity } from "@/core/resources/entity";

// GET /dashboard `beban_breakdown` — accrual operating expense split by category for the window.
// Fixed order [hpp, biaya_operasional, beban_lain_lain]. Disjoint from `beban.pajak` (PPh Final),
// which is surfaced as a separate field, not a breakdown category. sum(amount) === beban.amount.
export type ExpenseCategory = "hpp" | "biaya_operasional" | "beban_lain_lain";

export class BebanBreakdown implements AbstractEntity {
  constructor(
    public readonly category: ExpenseCategory,
    public readonly amount: number,
  ) {}
}
