import { Suspense } from "react";
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
import { DashboardActiveMembersCard } from "@/app/(authenticated)/home/_components/dashboard-active-members-card";
import { DashboardTotalProductsCard } from "@/app/(authenticated)/home/_components/dashboard-total-products-card";
import { DashboardLowStockCard } from "@/app/(authenticated)/home/_components/dashboard-low-stock-card";
import { DashboardRecentPosInvoices } from "@/app/(authenticated)/home/_components/dashboard-recent-pos-invoices";

export default function InvoiceHomePage() {
  return (
    <div className="space-y-6">
      <Suspense>
        <DashboardRangeProvider>
          <DashboardWelcomeHeader />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Main column — col-span-2 */}
            <div className="flex flex-col gap-6 xl:col-span-2">
              <section className="space-y-4 rounded-2xl bg-primary-50 p-4 md:p-6">
                <DashboardRangeSection />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <DashboardRangeRevenueTile />
                  <DashboardRangePosSalesTile />
                  <DashboardRangeDailyRevenueChart />
                  <DashboardRangePaymentBreakdown />
                  <DashboardCashflowSummary />
                </div>
                <DashboardRecentPosInvoices />
              </section>
              <DashboardRecentInvoices />
            </div>

            {/* Shoulder column — col-span-1 */}
            <div className="flex flex-col gap-4 xl:col-span-1">
              <DashboardStatistics />
              <DashboardActiveMembersCard />
              <DashboardTotalProductsCard />
              <DashboardLowStockCard />
            </div>
          </div>
        </DashboardRangeProvider>
      </Suspense>
    </div>
  );
}
