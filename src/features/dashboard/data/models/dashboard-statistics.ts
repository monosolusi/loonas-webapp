import { AbstractModel } from "@/core/resources/model";
import { DashboardStatisticsEntity } from "@/features/dashboard/domain/entities/dashboard-statistics";
import { PaymentMethodBreakdownModel } from "@/features/dashboard/data/models/payment-method-breakdown";
import { BebanBreakdownModel } from "@/features/dashboard/data/models/beban-breakdown";

interface DashboardStatisticsModelConstructor {
  period: { from: string; to: string };
  piutang: { amount: number; count: number };
  hutang: { amount: number; count: number };
  revenue: { amount: number; lastMonthAmount: number; changes: number | null };
  salesBreakdown: PaymentMethodBreakdownModel[];
  beban: { amount: number; lastMonthAmount: number; changes: number | null; pajak: number; labaUsaha: number };
  bebanBreakdown: BebanBreakdownModel[];
  kasKeluar: { amount: number; lastMonthAmount: number; changes: number | null };
}

export class DashboardStatisticsModel implements AbstractModel {
  public readonly period: { from: string; to: string };
  public readonly piutang: { amount: number; count: number };
  public readonly hutang: { amount: number; count: number };
  public readonly revenue: { amount: number; lastMonthAmount: number; changes: number | null };
  public readonly salesBreakdown: PaymentMethodBreakdownModel[];
  public readonly beban: {
    amount: number;
    lastMonthAmount: number;
    changes: number | null;
    pajak: number;
    labaUsaha: number;
  };
  public readonly bebanBreakdown: BebanBreakdownModel[];
  public readonly kasKeluar: { amount: number; lastMonthAmount: number; changes: number | null };

  constructor(args: DashboardStatisticsModelConstructor) {
    this.period = args.period;
    this.piutang = args.piutang;
    this.hutang = args.hutang;
    this.revenue = args.revenue;
    this.salesBreakdown = args.salesBreakdown;
    this.beban = args.beban;
    this.bebanBreakdown = args.bebanBreakdown;
    this.kasKeluar = args.kasKeluar;
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
      // New metrics — parsed defensively so a backend still on the old shape degrades to zero/empty
      // rather than throwing.
      beban: {
        amount: doc["beban"]?.["amount"] ?? 0,
        lastMonthAmount: doc["beban"]?.["last_month_amount"] ?? 0,
        changes: doc["beban"]?.["changes"] ?? null,
        pajak: doc["beban"]?.["pajak"] ?? 0,
        labaUsaha: doc["beban"]?.["laba_usaha"] ?? 0,
      },
      bebanBreakdown: Array.isArray(doc["beban_breakdown"])
        ? doc["beban_breakdown"].map((item: Record<string, any>) => BebanBreakdownModel.fromJson(item))
        : [],
      kasKeluar: {
        amount: doc["kas_keluar"]?.["amount"] ?? 0,
        lastMonthAmount: doc["kas_keluar"]?.["last_month_amount"] ?? 0,
        changes: doc["kas_keluar"]?.["changes"] ?? null,
      },
    });
  }

  public toEntity(): DashboardStatisticsEntity {
    return new DashboardStatisticsEntity({
      period: this.period,
      piutang: this.piutang,
      hutang: this.hutang,
      revenue: this.revenue,
      salesBreakdown: this.salesBreakdown.map((m) => m.toEntity()),
      beban: this.beban,
      bebanBreakdown: this.bebanBreakdown.map((m) => m.toEntity()),
      kasKeluar: this.kasKeluar,
    });
  }
}
