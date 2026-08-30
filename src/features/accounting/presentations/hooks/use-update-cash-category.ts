"use client";

import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { ACCOUNTING_MUTATION_KEYS, ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { CashCategoryRepositoryImpl } from "@/features/accounting/data/repositories/cash-category";
import { CashCategoryServiceImpl } from "@/features/accounting/data/sources/cash-category";
import { CashCategoryEntity } from "@/features/accounting/domain/entities/cash-category";
import {
  UpdateCashCategoryUseCase,
  UpdateCashCategoryUseCaseParams,
} from "@/features/accounting/domain/usecases/update-cash-category.usecases";

type UpdateCashCategoryTriggerParams = {
  id: string;
  name?: string;
  accountId?: string;
};
type UpdateCashCategoryFetcherParams = UpdateCashCategoryTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function UpdateCashCategoryFetcher(
  _: string,
  { arg }: { arg: UpdateCashCategoryFetcherParams },
): Promise<CashCategoryEntity> {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const repo = new CashCategoryRepositoryImpl(new CashCategoryServiceImpl(new HttpRequest()));
  const uc = new UpdateCashCategoryUseCase(repo, sessionRepo);
  const result = await uc.execute(new UpdateCashCategoryUseCaseParams(arg.id, arg.name, arg.accountId));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  // Fire-and-forget: `revalidateSWRKey` refetches and rethrows on a failed refetch, so
  // awaiting it here would report a successful update as failed.
  void revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_CASH_CATEGORIES).catch(() => {});
  return result.data;
}

export function useUpdateCashCategory() {
  return useSWRMutationClerk(ACCOUNTING_MUTATION_KEYS.UPDATE_CASH_CATEGORY, UpdateCashCategoryFetcher);
}
