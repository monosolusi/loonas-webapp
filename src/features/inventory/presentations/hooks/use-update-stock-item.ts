"use client";

import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { StockItemRepositoryImpl } from "@/features/inventory/data/repositories/stock-item";
import { StockItemServiceImpl } from "@/features/inventory/data/sources/stock-item";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import {
  UpdateStockItemUseCase,
  UpdateStockItemUseCaseParams,
} from "@/features/inventory/domain/usecases/update-stock-item.usecases";

type UpdateStockItemTriggerParams = { id: string; minStock: number | null };
type UpdateStockItemFetcherParams = UpdateStockItemTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function UpdateStockItemFetcher(
  _: string,
  { arg }: { arg: UpdateStockItemFetcherParams },
): Promise<StockItemEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const stockItemRepository = new StockItemRepositoryImpl(new StockItemServiceImpl(new HttpRequest()));
  const useCase = new UpdateStockItemUseCase(stockItemRepository, sessionRepository);
  const result = await useCase.execute(new UpdateStockItemUseCaseParams({ id: arg.id, minStock: arg.minStock }));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useUpdateStockItem() {
  return useSWRMutationClerk("update-stock-item", UpdateStockItemFetcher);
}
