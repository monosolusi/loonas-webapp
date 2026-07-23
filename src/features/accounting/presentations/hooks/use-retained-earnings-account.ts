"use client";

import { useMemo } from "react";
import { useListAllLedgerAccounts } from "@/features/accounting/presentations/hooks/use-list-all-ledger-accounts";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";

export function useRetainedEarningsAccount(): LedgerAccountEntity | null {
  const { accounts } = useListAllLedgerAccounts();
  return useMemo(() => (accounts ?? []).find((a) => a.code === "3200") ?? null, [accounts]);
}
