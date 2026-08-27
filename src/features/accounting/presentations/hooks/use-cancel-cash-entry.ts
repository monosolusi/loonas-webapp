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
import {
  CancelCashEntryUseCase,
  CancelCashEntryUseCaseParams,
} from "@/features/accounting/domain/usecases/cancel-cash-entry.usecases";

/**
 * `idempotencyKey` is required by the API — same reuse/rotation rule as
 * `useCreateCashEntry` (24h cache on create, 7-day cache on cancel; all status codes are
 * cached, so only rotate on a definitive 4xx). The returned entity is the newly created
 * CANCELLATION entry, not the original — see `CancelCashEntryUseCase`.
 */
type CancelCashEntryTriggerParams = {
  id: string;
  idempotencyKey: string;
  note?: string | null;
};
type CancelCashEntryFetcherParams = CancelCashEntryTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function CancelCashEntryFetcher(
  _: string,
  { arg }: { arg: CancelCashEntryFetcherParams },
): Promise<CashEntryEntity> {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const repo = new CashEntryRepositoryImpl(new CashEntryServiceImpl(new HttpRequest()));
  const uc = new CancelCashEntryUseCase(repo, sessionRepo);
  const result = await uc.execute(new CancelCashEntryUseCaseParams(arg.id, arg.idempotencyKey, arg.note));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useCancelCashEntry() {
  return useSWRMutationClerk(ACCOUNTING_MUTATION_KEYS.CANCEL_CASH_ENTRY, CancelCashEntryFetcher);
}
