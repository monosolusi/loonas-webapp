import { ProfitabilityDashboardProvider } from "@/app/(authenticated)/finance/profitability/_providers/profitability-dashboard-provider";
import { ProfitabilityTable } from "@/app/(authenticated)/finance/profitability/_components/profitability-table";

export default function ProfitabilityPage() {
  return (
    <ProfitabilityDashboardProvider>
      <div className="flex flex-col gap-y-6 p-6">
        <ProfitabilityTable />
      </div>
    </ProfitabilityDashboardProvider>
  );
}
