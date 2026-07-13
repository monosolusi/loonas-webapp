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
    <Suspense>
      <DashboardRangeProvider>
        {/* Single top-to-bottom flow of balanced rows — scrolls as one clean column instead of a
            tall/short two-column split. Small cards pair into equal 2-ups; wide content spans full width. */}
        <div className="flex flex-col gap-6">
          <DashboardWelcomeHeader />

          <DashboardRangeSection />

          {/* Period financial headline */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <DashboardRangePosSalesTile />
            <DashboardRangeReceivablesPayables />
          </div>

          {/* Period revenue detail — trend over time + composition by method */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <DashboardRangeDailyRevenueChart />
            <DashboardRangePaymentBreakdown />
          </div>

          {/* Inventory snapshot (point-in-time, not period-controlled) */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <DashboardTotalProductsCard />
            <DashboardLowStockCard />
          </div>

          {/* Full-width activity band */}
          <DashboardRecentActivity />
        </div>
      </DashboardRangeProvider>
    </Suspense>
  );
}
