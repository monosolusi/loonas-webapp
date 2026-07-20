import { AbstractModel } from "@/core/resources/model";
import { DashboardStatisticsEntity } from "@/features/dashboard/domain/entities/dashboard-statistics";
import { PaymentMethodBreakdownModel } from "@/features/dashboard/data/models/payment-method-breakdown";
import { ExpenseBreakdownModel } from "@/features/dashboard/data/models/expense-breakdown";

interface DashboardStatisticsModelConstructor {
  period: { from: string; to: string };
  accountsReceivable: { amount: number; count: number };
  accountsPayable: { amount: number; count: number };
  revenue: { amount: number; lastMonthAmount: number; changes: number | null };
  salesBreakdown: PaymentMethodBreakdownModel[];
  expense: { amount: number; lastMonthAmount: number; changes: number | null; tax: number; operatingProfit: number };
  expenseBreakdown: ExpenseBreakdownModel[];
  cashOut: { amount: number; lastMonthAmount: number; changes: number | null };
}

export class DashboardStatisticsModel implements AbstractModel {
  public readonly period: { from: string; to: string };
  public readonly accountsReceivable: { amount: number; count: number };
  public readonly accountsPayable: { amount: number; count: number };
  public readonly revenue: { amount: number; lastMonthAmount: number; changes: number | null };
  public readonly salesBreakdown: PaymentMethodBreakdownModel[];
  public readonly expense: {
    amount: number;
    lastMonthAmount: number;
    changes: number | null;
    tax: number;
    operatingProfit: number;
  };
  public readonly expenseBreakdown: ExpenseBreakdownModel[];
  public readonly cashOut: { amount: number; lastMonthAmount: number; changes: number | null };

  constructor(args: DashboardStatisticsModelConstructor) {
    this.period = args.period;
    this.accountsReceivable = args.accountsReceivable;
    this.accountsPayable = args.accountsPayable;
    this.revenue = args.revenue;
    this.salesBreakdown = args.salesBreakdown;
    this.expense = args.expense;
    this.expenseBreakdown = args.expenseBreakdown;
    this.cashOut = args.cashOut;
  }

  public static fromJson(doc: Record<string, any>): DashboardStatisticsModel {
    return new DashboardStatisticsModel({
      period: {
        from: doc["period"]["from"],
        to: doc["period"]["to"],
      },
      accountsReceivable: {
        amount: doc["accounts_receivable"]["amount"],
        count: doc["accounts_receivable"]["count"],
      },
      accountsPayable: {
        amount: doc["accounts_payable"]["amount"],
        count: doc["accounts_payable"]["count"],
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
      expense: {
        amount: doc["expense"]?.["amount"] ?? 0,
        lastMonthAmount: doc["expense"]?.["last_month_amount"] ?? 0,
        changes: doc["expense"]?.["changes"] ?? null,
        tax: doc["expense"]?.["tax"] ?? 0,
        operatingProfit: doc["expense"]?.["operating_profit"] ?? 0,
      },
      expenseBreakdown: Array.isArray(doc["expense_breakdown"])
        ? doc["expense_breakdown"].map((item: Record<string, any>) => ExpenseBreakdownModel.fromJson(item))
        : [],
      cashOut: {
        amount: doc["cash_out"]?.["amount"] ?? 0,
        lastMonthAmount: doc["cash_out"]?.["last_month_amount"] ?? 0,
        changes: doc["cash_out"]?.["changes"] ?? null,
      },
    });
  }

  public toEntity(): DashboardStatisticsEntity {
    return new DashboardStatisticsEntity({
      period: this.period,
      accountsReceivable: this.accountsReceivable,
      accountsPayable: this.accountsPayable,
      revenue: this.revenue,
      salesBreakdown: this.salesBreakdown.map((m) => m.toEntity()),
      expense: this.expense,
      expenseBreakdown: this.expenseBreakdown.map((m) => m.toEntity()),
      cashOut: this.cashOut,
    });
  }
}
