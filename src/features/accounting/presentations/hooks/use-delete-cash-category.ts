"use client";

import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { ACCOUNTING_MUTATION_KEYS, ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { CashCategoryRepositoryImpl } from "@/features/accounting/data/repositories/cash-category";
import { CashCategoryServiceImpl } from "@/features/accounting/data/sources/cash-category";
import {
  DeleteCashCategoryUseCase,
  DeleteCashCategoryUseCaseParams,
} from "@/features/accounting/domain/usecases/delete-cash-category.usecases";

type DeleteCashCategoryTriggerParams = { id: string };
type DeleteCashCategoryFetcherParams = DeleteCashCategoryTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function DeleteCashCategoryFetcher(_: string, { arg }: { arg: DeleteCashCategoryFetcherParams }): Promise<void> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const repository = new CashCategoryRepositoryImpl(new CashCategoryServiceImpl(new HttpRequest()));
  const useCase = new DeleteCashCategoryUseCase(repository, sessionRepository);
  const result = await useCase.execute(new DeleteCashCategoryUseCaseParams(arg.id));
  if (result instanceof DataFailed) throw result.error;

  // Fire-and-forget: `revalidateSWRKey` refetches and rethrows on a failed refetch, so
  // awaiting it here would report a successful delete as failed.
  void revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_CASH_CATEGORIES).catch(() => {});
}

export function useDeleteCashCategory() {
  return useSWRMutationClerk(ACCOUNTING_MUTATION_KEYS.DELETE_CASH_CATEGORY, DeleteCashCategoryFetcher);
}
