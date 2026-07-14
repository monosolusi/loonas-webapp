"use client";

import { useMemo } from "react";
import { CoaAccountRow } from "@/app/(authenticated)/settings/chart-of-accounts/accounts/_components/coa-account-row";
import { CoaAccountsTableHeader } from "@/app/(authenticated)/settings/chart-of-accounts/accounts/_components/coa-accounts-table-header";
import { CoaAccountsTableLoading } from "@/app/(authenticated)/settings/chart-of-accounts/accounts/_components/coa-accounts-table-loading";
import { CoaAccountsTableEmpty } from "@/app/(authenticated)/settings/chart-of-accounts/accounts/_components/coa-accounts-table-empty";
import { CoaAccountsTableError } from "@/app/(authenticated)/settings/chart-of-accounts/accounts/_components/coa-accounts-table-error";
import { useCoaAccounts } from "@/app/(authenticated)/settings/chart-of-accounts/accounts/_providers/coa-accounts-provider";

export function CoaAccountsTable() {
  const { accounts, allAccounts, loading, error, search, showSeeded } = useCoaAccounts();

  // Build parent name lookup from all loaded accounts
  const parentNameMap = useMemo<Map<string, string>>(() => {
    const map = new Map<string, string>();
    for (const a of allAccounts) {
      map.set(a.id, a.name);
    }
    return map;
  }, [allAccounts]);

  const isFiltered = search.trim().length > 0;
  const isEmpty = !loading && !error && accounts.length === 0;

  if (loading) return <CoaAccountsTableLoading />;
  if (error) return <CoaAccountsTableError />;
  if (isEmpty) return <CoaAccountsTableEmpty isFiltered={isFiltered} showSeeded={showSeeded} />;

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-100">
      <div className="overflow-x-auto">
        <div className="min-w-[820px]">
          <CoaAccountsTableHeader />
          {accounts.map((account) => (
            <CoaAccountRow
              key={account.id}
              account={account}
              parentName={account.parentId ? parentNameMap.get(account.parentId) : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
