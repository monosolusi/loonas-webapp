import { ProfitabilityDashboardProvider } from "@/app/(authenticated)/finance/profitability/_providers/profitability-dashboard-provider";
import { ProfitabilityListHeader } from "@/app/(authenticated)/finance/profitability/_components/profitability-list-header";
import { ProfitabilityListToolbar } from "@/app/(authenticated)/finance/profitability/_components/profitability-list-toolbar";
import { ProfitabilitySummaryCard } from "@/app/(authenticated)/finance/profitability/_components/profitability-summary-card";
import { ProfitabilityTable } from "@/app/(authenticated)/finance/profitability/_components/profitability-table";

export default function ProfitabilityPage() {
  return (
    <ProfitabilityDashboardProvider>
      <div className="flex flex-col gap-y-6">
        <ProfitabilityListHeader />
        <ProfitabilityListToolbar />
        <ProfitabilitySummaryCard />
        <ProfitabilityTable />
      </div>
    </ProfitabilityDashboardProvider>
  );
}
