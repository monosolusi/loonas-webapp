"use client";

import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { ACCOUNTING_MUTATION_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { CashEntryRepositoryImpl } from "@/features/accounting/data/repositories/cash-entry";
import { CashEntryServiceImpl } from "@/features/accounting/data/sources/cash-entry";
import { CashEntryEntity } from "@/features/accounting/domain/entities/cash-entry";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import {
  CreateCashEntryUseCase,
  CreateCashEntryUseCaseParams,
} from "@/features/accounting/domain/usecases/create-cash-entry.usecases";

/**
 * `idempotencyKey` is required by the API — mint it in the caller that owns form state
 * (`crypto.randomUUID()`) and reuse it across retries of the same logical attempt. The
 * server caches ALL status codes, including 4xx/5xx, for 24h — a retry on the same key
 * replays the cached response rather than re-attempting, so only rotate the key on a
 * definitive 4xx (mirrors the doc comment on `CreateCashEntryUseCaseParams`).
 */
type CreateCashEntryTriggerParams = {
  direction: CashEntryDirection;
  amount: number;
  categoryId: string;
  date: string;
  idempotencyKey: string;
  note?: string | null;
};
type CreateCashEntryFetcherParams = CreateCashEntryTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function CreateCashEntryFetcher(
  _: string,
  { arg }: { arg: CreateCashEntryFetcherParams },
): Promise<CashEntryEntity> {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const repo = new CashEntryRepositoryImpl(new CashEntryServiceImpl(new HttpRequest()));
  const uc = new CreateCashEntryUseCase(repo, sessionRepo);
  const result = await uc.execute(
    new CreateCashEntryUseCaseParams(
      arg.direction,
      arg.amount,
      arg.categoryId,
      arg.date,
      arg.idempotencyKey,
      arg.note,
    ),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useCreateCashEntry() {
  return useSWRMutationClerk(ACCOUNTING_MUTATION_KEYS.CREATE_CASH_ENTRY, CreateCashEntryFetcher);
}
