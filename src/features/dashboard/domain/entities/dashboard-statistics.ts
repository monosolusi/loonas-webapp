import { AbstractEntity } from "@/core/resources/entity";
import { PaymentMethodBreakdown } from "@/features/dashboard/domain/entities/payment-method-breakdown";
import { ExpenseBreakdown } from "@/features/dashboard/domain/entities/expense-breakdown";

interface DashboardStatisticsEntityConstructor {
  period: { from: string; to: string };
  accountsReceivable: { amount: number; count: number };
  accountsPayable: { amount: number; count: number };
  revenue: { amount: number; lastMonthAmount: number; changes: number | null };
  salesBreakdown: PaymentMethodBreakdown[];
  expense: { amount: number; lastMonthAmount: number; changes: number | null; tax: number; operatingProfit: number };
  expenseBreakdown: ExpenseBreakdown[];
  cashOut: { amount: number; lastMonthAmount: number; changes: number | null };
}

export class DashboardStatisticsEntity implements AbstractEntity {
  public readonly period: { from: string; to: string };
  public readonly accountsReceivable: { amount: number; count: number };
  public readonly accountsPayable: { amount: number; count: number };
  public readonly revenue: { amount: number; lastMonthAmount: number; changes: number | null };
  public readonly salesBreakdown: PaymentMethodBreakdown[];
  public readonly expense: {
    amount: number;
    lastMonthAmount: number;
    changes: number | null;
    tax: number;
    operatingProfit: number;
  };
  public readonly expenseBreakdown: ExpenseBreakdown[];
  public readonly cashOut: { amount: number; lastMonthAmount: number; changes: number | null };

  constructor(args: DashboardStatisticsEntityConstructor) {
    this.period = args.period;
    this.accountsReceivable = args.accountsReceivable;
    this.accountsPayable = args.accountsPayable;
    this.revenue = args.revenue;
    this.salesBreakdown = args.salesBreakdown;
    this.expense = args.expense;
    this.expenseBreakdown = args.expenseBreakdown;
    this.cashOut = args.cashOut;
  }
}
