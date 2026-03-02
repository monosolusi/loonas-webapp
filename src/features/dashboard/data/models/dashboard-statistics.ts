import { AbstractModel } from "@/core/resources/model";
import { DashboardStatisticsEntity } from "@/features/dashboard/domain/entities/dashboard-statistics";

interface DashboardStatisticsModelConstructor {
  period: { from: string; to: string };
  piutang: { amount: number; count: number };
  hutang: { amount: number; count: number };
  revenue: { amount: number; lastMonthAmount: number; changes: number | null };
}

export class DashboardStatisticsModel implements AbstractModel {
  public period: { from: string; to: string };
  public piutang: { amount: number; count: number };
  public hutang: { amount: number; count: number };
  public revenue: { amount: number; lastMonthAmount: number; changes: number | null };

  constructor(args: DashboardStatisticsModelConstructor) {
    this.period = args.period;
    this.piutang = args.piutang;
    this.hutang = args.hutang;
    this.revenue = args.revenue;
  }

  public static fromJson(doc: Record<string, any>): DashboardStatisticsModel {
    return new DashboardStatisticsModel({
      period: {
        from: doc["period"]["from"],
        to: doc["period"]["to"],
      },
      piutang: {
        amount: doc["piutang"]["amount"],
        count: doc["piutang"]["count"],
      },
      hutang: {
        amount: doc["hutang"]["amount"],
        count: doc["hutang"]["count"],
      },
      revenue: {
        amount: doc["revenue"]["amount"],
        lastMonthAmount: doc["revenue"]["last_month_amount"],
        changes: doc["revenue"]["changes"],
      },
    });
  }

  public toEntity(): DashboardStatisticsEntity {
    return new DashboardStatisticsEntity({
      period: this.period,
      piutang: this.piutang,
      hutang: this.hutang,
      revenue: this.revenue,
    });
  }
}
