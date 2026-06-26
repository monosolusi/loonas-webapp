"use client";

import { useMemo } from "react";
import { useListLedgerAccounts } from "@/features/accounting/presentations/hooks/use-list-ledger-accounts";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";

export function useRetainedEarningsAccount(): LedgerAccountEntity | null {
  const { accounts } = useListLedgerAccounts({ limit: 500 });
  return useMemo(() => (accounts ?? []).find((a) => a.code === "3200") ?? null, [accounts]);
}
