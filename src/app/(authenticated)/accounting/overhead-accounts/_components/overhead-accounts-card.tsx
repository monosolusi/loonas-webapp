"use client";

import { SectionCard } from "@/core/presentations/components/section-card";
import { useOverheadAccounts } from "@/app/(authenticated)/accounting/overhead-accounts/_providers/overhead-accounts-provider";
import { OverheadAccountPicker } from "@/app/(authenticated)/accounting/overhead-accounts/_components/overhead-account-picker";
import { OverheadAccountsError } from "@/app/(authenticated)/accounting/overhead-accounts/_components/overhead-accounts-error";
import { OverheadAccountsEmpty } from "@/app/(authenticated)/accounting/overhead-accounts/_components/overhead-accounts-empty";
import { OverheadAccountsTable } from "@/app/(authenticated)/accounting/overhead-accounts/_components/overhead-accounts-table";

export function OverheadAccountsCard() {
  const { error, onRetry, bufferAccounts } = useOverheadAccounts();

  if (error) return <OverheadAccountsError onRetry={onRetry} />;

  return (
    <SectionCard title="Akun Overhead Terpilih">
      <div className="flex flex-col gap-y-4">
        <OverheadAccountPicker />
        {bufferAccounts.length === 0 ? <OverheadAccountsEmpty /> : <OverheadAccountsTable />}
      </div>
    </SectionCard>
  );
}
