"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { FixedCostEntryRepositoryImpl } from "@/features/fixed-cost/data/repositories/fixed-cost-entry";
import { FixedCostEntryServiceImpl } from "@/features/fixed-cost/data/sources/fixed-cost-entry";
import { FixedCostEntryEntity } from "@/features/fixed-cost/domain/entities/fixed-cost-entry";
import {
  ListFixedCostEntriesByDateUseCase,
  ListFixedCostEntriesByDateUseCaseParams,
} from "@/features/fixed-cost/domain/usecases/list-fixed-cost-entries-by-date.usecases";
import { FIXED_COST_ENTRY_SWR_KEYS } from "@/features/fixed-cost/presentations/constants/fixed-cost-entry-swr-keys";

type FetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  startDate: string;
  endDate: string;
};

async function Fetcher([_, fetcherParams]: [string, FetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: fetcherParams.clerk }));
  const entryRepository = new FixedCostEntryRepositoryImpl(new FixedCostEntryServiceImpl(new HttpRequest()));
  const listByDate = new ListFixedCostEntriesByDateUseCase(entryRepository, sessionRepository);

  const result = await listByDate.execute(
    new ListFixedCostEntriesByDateUseCaseParams(fetcherParams.startDate, fetcherParams.endDate, undefined, 100),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return result.data.entries;
}

type UseListFixedCostEntriesByDateParams = {
  startDate: string;
  endDate: string;
};

type UseListFixedCostEntriesByDateReturnType = {
  entries: FixedCostEntryEntity[];
  loading: boolean;
  error: ServerError | null;
};

export function useListFixedCostEntriesByDate(params: UseListFixedCostEntriesByDateParams): UseListFixedCostEntriesByDateReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    [FIXED_COST_ENTRY_SWR_KEYS.LIST_BY_DATE, { clerk, ...params }],
    Fetcher,
  );

  return {
    entries: data ?? [],
    loading: isLoading,
    error: error instanceof ServerError ? error : null,
  };
}
