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
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import {
  CreateCashCategoryUseCase,
  CreateCashCategoryUseCaseParams,
} from "@/features/accounting/domain/usecases/create-cash-category.usecases";

type CreateCashCategoryTriggerParams = {
  name: string;
  accountId: string;
  direction: CashEntryDirection;
};
type CreateCashCategoryFetcherParams = CreateCashCategoryTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function CreateCashCategoryFetcher(
  _: string,
  { arg }: { arg: CreateCashCategoryFetcherParams },
): Promise<CashCategoryEntity> {
  const sessionRepo = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const repo = new CashCategoryRepositoryImpl(new CashCategoryServiceImpl(new HttpRequest()));
  const uc = new CreateCashCategoryUseCase(repo, sessionRepo);
  const result = await uc.execute(new CreateCashCategoryUseCaseParams(arg.name, arg.accountId, arg.direction));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  // Fire-and-forget: `revalidateSWRKey` refetches and rethrows on a failed refetch, so
  // awaiting it here would report a successful create as failed.
  void revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_CASH_CATEGORIES).catch(() => {});
  return result.data;
}

export function useCreateCashCategory() {
  return useSWRMutationClerk(ACCOUNTING_MUTATION_KEYS.CREATE_CASH_CATEGORY, CreateCashCategoryFetcher);
}
