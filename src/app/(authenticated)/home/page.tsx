import { Suspense } from "react";
import { DashboardRecentActivity } from "@/app/(authenticated)/home/_components/dashboard-recent-activity";
import { DashboardWelcomeHeader } from "@/app/(authenticated)/home/_components/dashboard-welcome-header";
import { DashboardRangeProvider } from "@/app/(authenticated)/home/_providers/dashboard-range-provider";
import { DashboardRangeSection } from "@/app/(authenticated)/home/_components/dashboard-range-section";
import { DashboardRangeDailyRevenueChart } from "@/app/(authenticated)/home/_components/dashboard-range-daily-revenue-chart";
import { DashboardRangePaymentBreakdown } from "@/app/(authenticated)/home/_components/dashboard-range-payment-breakdown";
import { DashboardRangePosSalesTile } from "@/app/(authenticated)/home/_components/dashboard-range-pos-sales-tile";
import { DashboardRangeReceivablesPayables } from "@/app/(authenticated)/home/_components/dashboard-range-receivables-payables";
import { DashboardTotalProductsCard } from "@/app/(authenticated)/home/_components/dashboard-total-products-card";
import { DashboardLowStockCard } from "@/app/(authenticated)/home/_components/dashboard-low-stock-card";

export default function InvoiceHomePage() {
  return (
    <div className="space-y-6">
      <Suspense>
        <DashboardRangeProvider>
          <DashboardWelcomeHeader />

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Main column — period-controlled widgets */}
            <div className="flex flex-col gap-6 xl:col-span-2">
              <DashboardRangeSection />
              <DashboardRangePosSalesTile />
              <DashboardRangeDailyRevenueChart />
              <DashboardRangePaymentBreakdown />
              <DashboardRangeReceivablesPayables />
            </div>

            {/* Shoulder column — always-on point-in-time */}
            <div className="flex flex-col gap-4 xl:col-span-1">
              <DashboardTotalProductsCard />
              <DashboardLowStockCard />
            </div>
          </div>

          {/* Full-width activity band — below the 2-col grid */}
          <DashboardRecentActivity />
        </DashboardRangeProvider>
      </Suspense>
    </div>
  );
}
