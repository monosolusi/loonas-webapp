"use client";

import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { LedgerAccountRepositoryImpl } from "@/features/accounting/data/repositories/ledger-account";
import { LedgerAccountServiceImpl } from "@/features/accounting/data/sources/ledger-account";
import { DeleteLedgerAccountParams } from "@/features/accounting/domain/repositories/ledger-account";
import {
  DeleteLedgerAccountUseCase,
  DeleteLedgerAccountUseCaseParams,
} from "@/features/accounting/domain/usecases/delete-ledger-account.usecases";

type DeleteLedgerAccountTriggerParams = DeleteLedgerAccountParams;
type DeleteLedgerAccountFetcherParams = DeleteLedgerAccountTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function DeleteLedgerAccountFetcher(
  _: string,
  { arg }: { arg: DeleteLedgerAccountFetcherParams },
): Promise<void> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const repository = new LedgerAccountRepositoryImpl(new LedgerAccountServiceImpl(new HttpRequest()));
  const useCase = new DeleteLedgerAccountUseCase(repository, sessionRepository);
  const result = await useCase.execute(new DeleteLedgerAccountUseCaseParams(arg.id));
  if (result instanceof DataFailed) throw result.error;
}

export function useDeleteLedgerAccount() {
  return useSWRMutationClerk("delete-ledger-account", DeleteLedgerAccountFetcher);
}
