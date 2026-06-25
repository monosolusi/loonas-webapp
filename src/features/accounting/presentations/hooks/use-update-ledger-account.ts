"use client";

import { useClerk } from "@clerk/nextjs";
import { HttpRequest } from "@/core/helpers/http-request";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { LedgerAccountRepositoryImpl } from "@/features/accounting/data/repositories/ledger-account";
import { LedgerAccountServiceImpl } from "@/features/accounting/data/sources/ledger-account";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { UpdateLedgerAccountParams } from "@/features/accounting/domain/repositories/ledger-account";
import {
  UpdateLedgerAccountUseCase,
  UpdateLedgerAccountUseCaseParams,
} from "@/features/accounting/domain/usecases/update-ledger-account.usecases";

type UpdateLedgerAccountTriggerParams = UpdateLedgerAccountParams;
type UpdateLedgerAccountFetcherParams = UpdateLedgerAccountTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function UpdateLedgerAccountFetcher(
  _: string,
  { arg }: { arg: UpdateLedgerAccountFetcherParams },
): Promise<LedgerAccountEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const repository = new LedgerAccountRepositoryImpl(new LedgerAccountServiceImpl(new HttpRequest()));
  const useCase = new UpdateLedgerAccountUseCase(repository, sessionRepository);
  const result = await useCase.execute(
    new UpdateLedgerAccountUseCaseParams(arg.id, arg.name, arg.code, arg.type, arg.parent),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useUpdateLedgerAccount() {
  return useSWRMutationClerk("update-ledger-account", UpdateLedgerAccountFetcher);
}
