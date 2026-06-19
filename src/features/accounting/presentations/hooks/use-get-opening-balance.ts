"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { OpeningBalanceRepositoryImpl } from "@/features/accounting/data/repositories/opening-balance";
import { OpeningBalanceServiceImpl } from "@/features/accounting/data/sources/opening-balance";
import { GetOpeningBalanceUseCase } from "@/features/accounting/domain/usecases/get-opening-balance.usecases";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { UseGetOpeningBalanceResult } from "@/features/accounting/presentations/hooks/use-get-opening-balance.types";

type FetcherParams = { clerk: ReturnType<typeof useClerk> };

async function GetOpeningBalanceFetcher([_, params]: [string, FetcherParams]) {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: params.clerk }));
  const repo = new OpeningBalanceRepositoryImpl(new OpeningBalanceServiceImpl(new HttpRequest()));
  const uc = new GetOpeningBalanceUseCase(repo, sessionRepo);
  const result = await uc.execute();
  // DataFailed is treated as empty (no migration) to avoid breaking the Laba Rugi page.
  if (result instanceof DataFailed) return null;
  return result.data ?? null;
}

// Deviation approved by EL (engineer-lead) for LNS-344: errors/404 collapse to isMigration:false by design — advisory fetch, see arch-review M1.
export function useGetOpeningBalance(): UseGetOpeningBalanceResult {
  const clerk = useClerk();

  const { data, isLoading } = useSWR([ACCOUNTING_SWR_KEYS.GET_OPENING_BALANCE, { clerk }], GetOpeningBalanceFetcher, {
    // Never surface an error from this hook — a fetch failure simply means no migration notice.
    onErrorRetry: () => undefined,
  });

  const isMigration = data != null && data.lines.some((l) => l.accountCode === "3200");

  return {
    isMigration,
    loading: isLoading,
  };
}
