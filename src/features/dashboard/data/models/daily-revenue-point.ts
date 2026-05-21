import { AbstractModel } from "@/core/resources/model";
import { DailyRevenuePoint } from "@/features/dashboard/domain/entities/daily-revenue-point";

export class DailyRevenuePointModel implements AbstractModel {
  constructor(
    public readonly date: string,
    public readonly revenue: number,
    public readonly transactionCount: number,
  ) {}

  public static fromJson(doc: Record<string, any>): DailyRevenuePointModel {
    return new DailyRevenuePointModel(doc["date"], doc["revenue"] ?? 0, doc["transaction_count"] ?? 0);
  }

  public toEntity(): DailyRevenuePoint {
    return new DailyRevenuePoint(this.date, this.revenue, this.transactionCount);
  }
}
