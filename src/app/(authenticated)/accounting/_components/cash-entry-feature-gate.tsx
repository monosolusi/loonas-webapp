"use client";

import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";
import { CashEntryAccessDenied } from "@/app/(authenticated)/accounting/_components/cash-entry-access-denied";

export const CASH_ENTRY_FEATURE = "cash_entry";

export function CashEntryFeatureGate({ children }: { children: React.ReactNode }) {
  const { account, loading } = useGetCurrentAccount();
  if (loading) return null;
  if (!account?.hasFeature(CASH_ENTRY_FEATURE)) return <CashEntryAccessDenied />;
  return <>{children}</>;
}