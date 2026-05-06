"use client";

import useSWR from "swr";
import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { PosSaleRepositoryImpl } from "@/features/pos/data/repositories/pos-sale";
import { PosSaleServiceImpl } from "@/features/pos/data/sources/pos-sale";
import { ListPosSalesResult } from "@/features/pos/domain/repositories/pos-sale";
import {
  ListPosSalesUseCase,
  ListPosSalesUseCaseParams,
} from "@/features/pos/domain/usecases/list-pos-sales.usecases";
import { POS_SWR_KEYS } from "@/features/pos/presentations/constants/swr-keys";
import {
  ListPosSaleFetcherParams,
  UseListPosSalesState,
} from "@/features/pos/presentations/hooks/use-list-pos-sales.types";

async function ListPosSaleFetcher([_, fetcherParams]: [string, ListPosSaleFetcherParams]): Promise<ListPosSalesResult> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: fetcherParams.clerk }));
  const posSaleRepository = new PosSaleRepositoryImpl(new PosSaleServiceImpl(new HttpRequest()));
  const listPosSales = new ListPosSalesUseCase(posSaleRepository, sessionRepository);

  const result = await listPosSales.execute(new ListPosSalesUseCaseParams(fetcherParams.page, fetcherParams.limit));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

type UseListPosSalesParams = {
  page: number;
  limit: number;
};

export function useListPosSales({ page, limit }: UseListPosSalesParams): UseListPosSalesState {
  const clerk = useClerk();

  const { data, error } = useSWR(
    [POS_SWR_KEYS.LIST_POS_SALES, { clerk, page, limit }],
    ListPosSaleFetcher,
  );

  if (error) {
    const serverError = error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN, { error });
    return { status: "error", sales: null, meta: null, error: serverError };
  }
  if (!data) return { status: "loading", sales: null, meta: null, error: null };
  return { status: "loaded", sales: data.sales, meta: data.meta, error: null };
}
