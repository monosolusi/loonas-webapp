import { AbstractModel } from "@/core/resources/model";
import { ExpenseBreakdown, ExpenseCategory } from "@/features/dashboard/domain/entities/expense-breakdown";

export class ExpenseBreakdownModel implements AbstractModel {
  constructor(
    public readonly category: ExpenseCategory,
    public readonly amount: number,
  ) {}

  public static fromJson(doc: Record<string, any>): ExpenseBreakdownModel {
    return new ExpenseBreakdownModel(doc["category"] as ExpenseCategory, doc["amount"] ?? 0);
  }

  public toEntity(): ExpenseBreakdown {
    return new ExpenseBreakdown(this.category, this.amount);
  }
}
