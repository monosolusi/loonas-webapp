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
import { PosSaleEntity } from "@/features/pos/domain/entities/pos-sale";
import {
  GetPosSaleUseCase,
  GetPosSaleUseCaseParams,
} from "@/features/pos/domain/usecases/get-pos-sale.usecases";
import { POS_SWR_KEYS } from "@/features/pos/presentations/constants/swr-keys";
import {
  GetPosSaleFetcherParams,
  UseGetPosSaleState,
} from "@/features/pos/presentations/hooks/use-get-pos-sale.types";

async function GetPosSaleFetcher([_, fetcherParams]: [string, GetPosSaleFetcherParams]): Promise<PosSaleEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: fetcherParams.clerk }));
  const posSaleRepository = new PosSaleRepositoryImpl(new PosSaleServiceImpl(new HttpRequest()));
  const getPosSale = new GetPosSaleUseCase(posSaleRepository, sessionRepository);

  const result = await getPosSale.execute(new GetPosSaleUseCaseParams(fetcherParams.id));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useGetPosSale(id: string | null): UseGetPosSaleState {
  const clerk = useClerk();

  const { data, error } = useSWR(id ? [POS_SWR_KEYS.GET_POS_SALE, { clerk, id }] : null, GetPosSaleFetcher);

  if (error) {
    const serverError = error instanceof ServerError ? error : new ServerError(ErrorCodes.UNKNOWN, { error });
    return { status: "error", sale: null, error: serverError };
  }
  if (!data) return { status: "loading", sale: null, error: null };
  return { status: "loaded", sale: data, error: null };
}
