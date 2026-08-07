"use client";

import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { StockAdjustmentRepositoryImpl } from "@/features/inventory/data/repositories/stock-adjustment";
import { StockAdjustmentServiceImpl } from "@/features/inventory/data/sources/stock-adjustment";
import { StockMovementEntity } from "@/features/inventory/domain/entities/stock-movement";
import {
  AdjustStockItemUseCase,
  AdjustStockItemUseCaseParams,
  AdjustStockItemChannel,
} from "@/features/inventory/domain/usecases/adjust-stock-item.usecases";

type AdjustStockItemTriggerParams = {
  stockItemId: string;
  channel: AdjustStockItemChannel;
  quantity: number;
  reason: string;
  note: string | null;
  expectedBookQuantity?: number;
  idempotencyKey: string;
};
type AdjustStockItemFetcherParams = AdjustStockItemTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function AdjustStockItemFetcher(
  _: string,
  { arg }: { arg: AdjustStockItemFetcherParams },
): Promise<StockMovementEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const stockAdjustmentRepository = new StockAdjustmentRepositoryImpl(new StockAdjustmentServiceImpl(new HttpRequest()));
  const useCase = new AdjustStockItemUseCase(stockAdjustmentRepository, sessionRepository);
  const result = await useCase.execute(
    new AdjustStockItemUseCaseParams({
      stockItemId: arg.stockItemId,
      channel: arg.channel,
      quantity: arg.quantity,
      reason: arg.reason,
      note: arg.note,
      expectedBookQuantity: arg.expectedBookQuantity,
      idempotencyKey: arg.idempotencyKey,
    }),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useAdjustStockItem() {
  return useSWRMutationClerk("adjust-stock-item", AdjustStockItemFetcher);
}