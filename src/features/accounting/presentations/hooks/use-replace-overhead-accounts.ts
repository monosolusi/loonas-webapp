"use client";

import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { ACCOUNTING_MUTATION_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { OverheadAccountRepositoryImpl } from "@/features/accounting/data/repositories/overhead-account";
import { OverheadAccountServiceImpl } from "@/features/accounting/data/sources/overhead-account";
import { OverheadAccountSelectionEntity } from "@/features/accounting/domain/entities/overhead-account-selection";
import {
  ReplaceOverheadAccountsUseCase,
  ReplaceOverheadAccountsUseCaseParams,
} from "@/features/accounting/domain/usecases/replace-overhead-accounts.usecases";

// Defined locally rather than imported from domain/repositories — the use case owns its own
// params (constructed below via ReplaceOverheadAccountsUseCaseParams); this type only shapes
// what the trigger function accepts.
type ReplaceOverheadAccountsTriggerParams = { accountIds: string[] };
type ReplaceOverheadAccountsFetcherParams = ReplaceOverheadAccountsTriggerParams & {
  clerk: ReturnType<typeof useClerk>;
};

async function ReplaceOverheadAccountsFetcher(
  _: string,
  { arg }: { arg: ReplaceOverheadAccountsFetcherParams },
): Promise<OverheadAccountSelectionEntity[]> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const repository = new OverheadAccountRepositoryImpl(new OverheadAccountServiceImpl(new HttpRequest()));
  const useCase = new ReplaceOverheadAccountsUseCase(repository, sessionRepository);
  const result = await useCase.execute(new ReplaceOverheadAccountsUseCaseParams(arg.accountIds));
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useReplaceOverheadAccounts() {
  return useSWRMutationClerk(ACCOUNTING_MUTATION_KEYS.REPLACE_OVERHEAD_ACCOUNTS, ReplaceOverheadAccountsFetcher);
}
