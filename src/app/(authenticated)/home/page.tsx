import { Suspense } from "react";
import { DashboardRecentActivity } from "@/app/(authenticated)/home/_components/dashboard-recent-activity";
import { DashboardWelcomeHeader } from "@/app/(authenticated)/home/_components/dashboard-welcome-header";
import { DashboardRangeProvider } from "@/app/(authenticated)/home/_providers/dashboard-range-provider";
import { DashboardRangeSection } from "@/app/(authenticated)/home/_components/dashboard-range-section";
import { DashboardRangeDailyRevenueChart } from "@/app/(authenticated)/home/_components/dashboard-range-daily-revenue-chart";
import { DashboardRangePaymentBreakdown } from "@/app/(authenticated)/home/_components/dashboard-range-payment-breakdown";
import { DashboardRangePosSalesTile } from "@/app/(authenticated)/home/_components/dashboard-range-pos-sales-tile";
import { DashboardRangeExpenseTile } from "@/app/(authenticated)/home/_components/dashboard-range-expense-tile";
import { DashboardRangeOperatingProfitCard } from "@/app/(authenticated)/home/_components/dashboard-range-operating-profit-card";
import { DashboardRangeCashOutTile } from "@/app/(authenticated)/home/_components/dashboard-range-cash-out-tile";
import { DashboardRangeExpenseBreakdown } from "@/app/(authenticated)/home/_components/dashboard-range-expense-breakdown";
import { DashboardRangeReceivablesPayables } from "@/app/(authenticated)/home/_components/dashboard-range-receivables-payables";
import { DashboardLowStockCard } from "@/app/(authenticated)/home/_components/dashboard-low-stock-card";

export default function InvoiceHomePage() {
  return (
    <Suspense>
      <DashboardRangeProvider>
        {/* Single top-to-bottom flow of balanced rows — scrolls as one clean column. Small cards pair
            into equal 2-ups by visual weight; the wide chart spans full width. */}
        <div className="flex flex-col gap-6">
          <DashboardWelcomeHeader />

          <DashboardRangeSection />

          {/* Accrual headline figures for the period — money in vs money out */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <DashboardRangePosSalesTile />
            <DashboardRangeExpenseTile />
          </div>

          {/* Operating profit (Laba-Rugi) + cash outflow (Arus-Kas) */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <DashboardRangeOperatingProfitCard />
            <DashboardRangeCashOutTile />
          </div>

          {/* Outstanding balances + inventory restock alert */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <DashboardRangeReceivablesPayables />
            <DashboardLowStockCard />
          </div>

          {/* Period revenue over time — full width for legibility across long ranges */}
          <DashboardRangeDailyRevenueChart />

          {/* Composition of revenue vs expense — two balanced list cards */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <DashboardRangePaymentBreakdown />
            <DashboardRangeExpenseBreakdown />
          </div>

          {/* Full-width activity band */}
          <DashboardRecentActivity />
        </div>
      </DashboardRangeProvider>
    </Suspense>
  );
}
