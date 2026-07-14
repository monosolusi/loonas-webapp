import { AbstractEntity } from "@/core/resources/entity";
import { PaymentMethodBreakdown } from "@/features/dashboard/domain/entities/payment-method-breakdown";
import { BebanBreakdown } from "@/features/dashboard/domain/entities/beban-breakdown";

interface DashboardStatisticsEntityConstructor {
  period: { from: string; to: string };
  piutang: { amount: number; count: number };
  hutang: { amount: number; count: number };
  revenue: { amount: number; lastMonthAmount: number; changes: number | null };
  salesBreakdown: PaymentMethodBreakdown[];
  beban: { amount: number; lastMonthAmount: number; changes: number | null; pajak: number; labaUsaha: number };
  bebanBreakdown: BebanBreakdown[];
  kasKeluar: { amount: number; lastMonthAmount: number; changes: number | null };
}

export class DashboardStatisticsEntity implements AbstractEntity {
  public readonly period: { from: string; to: string };
  public readonly piutang: { amount: number; count: number };
  public readonly hutang: { amount: number; count: number };
  public readonly revenue: { amount: number; lastMonthAmount: number; changes: number | null };
  public readonly salesBreakdown: PaymentMethodBreakdown[];
  public readonly beban: {
    amount: number;
    lastMonthAmount: number;
    changes: number | null;
    pajak: number;
    labaUsaha: number;
  };
  public readonly bebanBreakdown: BebanBreakdown[];
  public readonly kasKeluar: { amount: number; lastMonthAmount: number; changes: number | null };

  constructor(args: DashboardStatisticsEntityConstructor) {
    this.period = args.period;
    this.piutang = args.piutang;
    this.hutang = args.hutang;
    this.revenue = args.revenue;
    this.salesBreakdown = args.salesBreakdown;
    this.beban = args.beban;
    this.bebanBreakdown = args.bebanBreakdown;
    this.kasKeluar = args.kasKeluar;
  }
}
