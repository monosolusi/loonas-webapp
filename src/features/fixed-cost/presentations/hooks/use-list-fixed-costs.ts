"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PaginationMeta } from "@/core/resources/paginated";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { FixedCostRepositoryImpl } from "@/features/fixed-cost/data/repositories/fixed-cost";
import { FixedCostServiceImpl } from "@/features/fixed-cost/data/sources/fixed-cost";
import { FixedCostEntity } from "@/features/fixed-cost/domain/entities/fixed-cost";
import { ListFixedCostsParams } from "@/features/fixed-cost/domain/repositories/fixed-cost";
import {
  ListFixedCostsUseCase,
  ListFixedCostsUseCaseParams,
} from "@/features/fixed-cost/domain/usecases/list-fixed-costs.usecases";
import { FIXED_COST_SWR_KEYS } from "@/features/fixed-cost/presentations/constants/swr-keys";

type FetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  params: ListFixedCostsParams;
};

async function Fetcher([_, fetcherParams]: [string, FetcherParams]) {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: fetcherParams.clerk }));
  const fixedCostRepository = new FixedCostRepositoryImpl(new FixedCostServiceImpl(new HttpRequest()));
  const listFixedCosts = new ListFixedCostsUseCase(fixedCostRepository, sessionRepository);

  const result = await listFixedCosts.execute(new ListFixedCostsUseCaseParams(fetcherParams.params));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return result.data;
}

type UseListFixedCostsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

type UseListFixedCostsReturnType = {
  fixedCosts: FixedCostEntity[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: ServerError | null;
};

export function useListFixedCosts(params: UseListFixedCostsParams = {}): UseListFixedCostsReturnType {
  const clerk = useClerk();
  const { data, isLoading, error } = useSWR(
    [FIXED_COST_SWR_KEYS.LIST_FIXED_COSTS, { clerk, params }],
    Fetcher,
  );

  return {
    fixedCosts: data?.fixedCosts ?? [],
    meta: data?.meta ?? null,
    loading: isLoading,
    error: error instanceof ServerError ? error : null,
  };
}
