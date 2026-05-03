"use client";

import { mutate as globalMutate } from "swr";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { PosSaleRepositoryImpl } from "@/features/pos/data/repositories/pos-sale";
import { PosSaleServiceImpl } from "@/features/pos/data/sources/pos-sale";
import { PosSaleEntity } from "@/features/pos/domain/entities/pos-sale";
import {
  CreatePosSaleUseCase,
  CreatePosSaleUseCaseParams,
} from "@/features/pos/domain/usecases/create-pos-sale.usecases";
import { POS_SWR_KEYS } from "@/features/pos/presentations/constants/swr-keys";
import {
  CreatePosSaleFetcherParams,
  CreatePosSaleHookParams,
} from "@/features/pos/presentations/hooks/use-create-pos-sale.types";

async function CreatePosSaleFetcher(
  _: string,
  { arg }: { arg: CreatePosSaleFetcherParams },
): Promise<PosSaleEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const posSaleRepository = new PosSaleRepositoryImpl(new PosSaleServiceImpl(new HttpRequest()));
  const createPosSale = new CreatePosSaleUseCase(posSaleRepository, sessionRepository);

  const result = await createPosSale.execute(
    new CreatePosSaleUseCaseParams(arg.date, arg.paymentGatewayId, arg.discount, arg.note, arg.items, arg.idempotencyKey),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  const sale = result.data;
  await globalMutate(
    (key: unknown) =>
      Array.isArray(key) &&
      key[0] === POS_SWR_KEYS.GET_POS_SALE &&
      (key[1] as { id?: string } | undefined)?.id === sale.id,
    sale,
    { revalidate: false },
  );

  return sale;
}

export function useCreatePosSale() {
  return useSWRMutationClerk<PosSaleEntity, CreatePosSaleHookParams>("create-pos-sale", CreatePosSaleFetcher);
}
