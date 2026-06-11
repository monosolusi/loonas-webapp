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
  ListFixedCostEntriesUseCase,
  ListFixedCostEntriesUseCaseParams,
} from "@/features/fixed-cost/domain/usecases/list-fixed-cost-entries.usecases";
import { FIXED_COST_ENTRY_SWR_KEYS } from "@/features/fixed-cost/presentations/constants/fixed-cost-entry-swr-keys";

export type FixedCostMonthEntry = {
  fixedCostId: string;
  entry: FixedCostEntryEntity | null;
};

type FetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  fixedCostIds: string[];
  startDate: string;
  endDate: string;
};

async function Fetcher([_, fetcherParams]: [string, FetcherParams]): Promise<FixedCostMonthEntry[]> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: fetcherParams.clerk }));
  const entryRepository = new FixedCostEntryRepositoryImpl(new FixedCostEntryServiceImpl(new HttpRequest()));
  const listEntries = new ListFixedCostEntriesUseCase(entryRepository, sessionRepository);

  return Promise.all(
    fetcherParams.fixedCostIds.map(async (fixedCostId) => {
      const result = await listEntries.execute(new ListFixedCostEntriesUseCaseParams(fixedCostId, undefined, 100));
      if (result instanceof DataFailed) throw result.error;
      if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const matchingEntry = result.data.entries.find(
        (e) => e.startDate === fetcherParams.startDate && e.endDate === fetcherParams.endDate,
      );

      return { fixedCostId, entry: matchingEntry ?? null };
    }),
  );
}

type UseListFixedCostEntriesParams = {
  fixedCostIds: string[];
  startDate: string;
  endDate: string;
};

type UseListFixedCostEntriesReturnType = {
  monthEntries: FixedCostMonthEntry[];
  loading: boolean;
  error: ServerError | null;
};

export function useListFixedCostEntries(params: UseListFixedCostEntriesParams): UseListFixedCostEntriesReturnType {
  const clerk = useClerk();
  const hasIds = params.fixedCostIds.length > 0;

  const { data, isLoading, error } = useSWR(
    hasIds ? [FIXED_COST_ENTRY_SWR_KEYS.LIST, { clerk, ...params }] : null,
    Fetcher,
  );

  return {
    monthEntries: data ?? [],
    loading: isLoading,
    error: error instanceof ServerError ? error : null,
  };
}
