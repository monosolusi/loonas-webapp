import { AbstractModel } from "@/core/resources/model";
import { DashboardStatisticsEntity } from "@/features/dashboard/domain/entities/dashboard-statistics";
import { PaymentMethodBreakdownModel } from "@/features/dashboard/data/models/payment-method-breakdown";

interface DashboardStatisticsModelConstructor {
  period: { from: string; to: string };
  piutang: { amount: number; count: number };
  hutang: { amount: number; count: number };
  revenue: { amount: number; lastMonthAmount: number; changes: number | null };
  salesBreakdown: PaymentMethodBreakdownModel[];
}

export class DashboardStatisticsModel implements AbstractModel {
  public readonly period: { from: string; to: string };
  public readonly piutang: { amount: number; count: number };
  public readonly hutang: { amount: number; count: number };
  public readonly revenue: { amount: number; lastMonthAmount: number; changes: number | null };
  public readonly salesBreakdown: PaymentMethodBreakdownModel[];

  constructor(args: DashboardStatisticsModelConstructor) {
    this.period = args.period;
    this.piutang = args.piutang;
    this.hutang = args.hutang;
    this.revenue = args.revenue;
    this.salesBreakdown = args.salesBreakdown;
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
      salesBreakdown: Array.isArray(doc["sales_breakdown"])
        ? doc["sales_breakdown"].map((item: Record<string, any>) => PaymentMethodBreakdownModel.fromJson(item))
        : [],
    });
  }

  public toEntity(): DashboardStatisticsEntity {
    return new DashboardStatisticsEntity({
      period: this.period,
      piutang: this.piutang,
      hutang: this.hutang,
      revenue: this.revenue,
      salesBreakdown: this.salesBreakdown.map((m) => m.toEntity()),
    });
  }
}
