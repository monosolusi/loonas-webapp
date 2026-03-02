import { AbstractEntity } from "@/core/resources/entity";

interface DashboardStatisticsEntityConstructor {
  period: { from: string; to: string };
  piutang: { amount: number; count: number };
  hutang: { amount: number; count: number };
  revenue: { amount: number; lastMonthAmount: number; changes: number | null };
}

export class DashboardStatisticsEntity implements AbstractEntity {
  public period: { from: string; to: string };
  public piutang: { amount: number; count: number };
  public hutang: { amount: number; count: number };
  public revenue: { amount: number; lastMonthAmount: number; changes: number | null };

  constructor(args: DashboardStatisticsEntityConstructor) {
    this.period = args.period;
    this.piutang = args.piutang;
    this.hutang = args.hutang;
    this.revenue = args.revenue;
  }
}
