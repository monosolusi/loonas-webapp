import { AbstractModel } from "@/core/resources/model";
import { BebanBreakdown, ExpenseCategory } from "@/features/dashboard/domain/entities/beban-breakdown";

export class BebanBreakdownModel implements AbstractModel {
  constructor(
    public readonly category: ExpenseCategory,
    public readonly amount: number,
  ) {}

  public static fromJson(doc: Record<string, any>): BebanBreakdownModel {
    return new BebanBreakdownModel(doc["category"] as ExpenseCategory, doc["amount"] ?? 0);
  }

  public toEntity(): BebanBreakdown {
    return new BebanBreakdown(this.category, this.amount);
  }
}
