import { Suspense } from "react";
import clsx from "clsx";
import { DashboardStatistics } from "@/app/(authenticated)/home/_components/dashboard-statistics";
import { DashboardRecentInvoices } from "@/app/(authenticated)/home/_components/dashboard-recent-invoices";
import { DashboardCashflowSummary } from "@/app/(authenticated)/home/_components/dashboard-cashflow-summary";
import { DashboardWelcomeHeader } from "@/app/(authenticated)/home/_components/dashboard-welcome-header";
import { DashboardRangeProvider } from "@/app/(authenticated)/home/_providers/dashboard-range-provider";
import { DashboardRangeSection } from "@/app/(authenticated)/home/_components/dashboard-range-section";
import { DashboardRangeRevenueTile } from "@/app/(authenticated)/home/_components/dashboard-range-revenue-tile";
import { DashboardRangeDailyRevenueChart } from "@/app/(authenticated)/home/_components/dashboard-range-daily-revenue-chart";
import { DashboardRangePaymentBreakdown } from "@/app/(authenticated)/home/_components/dashboard-range-payment-breakdown";
import { DashboardRangePosSalesTile } from "@/app/(authenticated)/home/_components/dashboard-range-pos-sales-tile";

export default function InvoiceHomePage() {
  return (
    <div className="space-y-6">
      <Suspense>
        <DashboardRangeProvider>
          <DashboardWelcomeHeader />

          {/* Tinted period-scoped zone */}
          <section className={clsx("space-y-4 rounded-2xl bg-primary-50 p-4 md:p-6")}>
            <DashboardRangeSection />
            <div className={clsx("grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3")}>
              <DashboardRangeRevenueTile />
              <DashboardRangePosSalesTile />
              <DashboardRangeDailyRevenueChart />
              <DashboardRangePaymentBreakdown />
              <DashboardCashflowSummary />
            </div>
          </section>

          {/* Untinted point-in-time zone */}
          <DashboardStatistics />
          <DashboardRecentInvoices />
        </DashboardRangeProvider>
      </Suspense>
    </div>
  );
}
