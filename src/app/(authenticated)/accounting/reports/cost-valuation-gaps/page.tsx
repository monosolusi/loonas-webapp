"use client";

import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";
import { CostValuationGapsProvider } from "@/app/(authenticated)/accounting/reports/cost-valuation-gaps/_providers/cost-valuation-gaps-provider";
import { CostValuationGapsView } from "@/app/(authenticated)/accounting/reports/cost-valuation-gaps/_components/cost-valuation-gaps-view";
import { CostValuationGapsAccessDenied } from "@/app/(authenticated)/accounting/reports/cost-valuation-gaps/_components/cost-valuation-gaps-access-denied";

export default function CostValuationGapsPage() {
  const { account, loading: accountLoading } = useGetCurrentAccount();

  if (accountLoading) return null;
  if (!account?.hasFeature("accounting")) return <CostValuationGapsAccessDenied />;

  return (
    <CostValuationGapsProvider>
      <CostValuationGapsView />
    </CostValuationGapsProvider>
  );
}