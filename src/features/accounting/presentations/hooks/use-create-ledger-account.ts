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
import {
  CreateLedgerAccountUseCase,
  CreateLedgerAccountUseCaseParams,
} from "@/features/accounting/domain/usecases/create-ledger-account.usecases";
import { AccountType } from "@/features/accounting/domain/enums/account-type";

// Trigger params are the business fields only — idempotencyKey is generated inside execute()
type CreateLedgerAccountTriggerParams = {
  code: string;
  name: string;
  type: AccountType | string;
  parentId?: string;
};
type CreateLedgerAccountFetcherParams = CreateLedgerAccountTriggerParams & { clerk: ReturnType<typeof useClerk> };

async function CreateLedgerAccountFetcher(
  _: string,
  { arg }: { arg: CreateLedgerAccountFetcherParams },
): Promise<LedgerAccountEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const repository = new LedgerAccountRepositoryImpl(new LedgerAccountServiceImpl(new HttpRequest()));
  const useCase = new CreateLedgerAccountUseCase(repository, sessionRepository);
  const result = await useCase.execute(
    new CreateLedgerAccountUseCaseParams(arg.code, arg.name, arg.type as AccountType, arg.parentId),
  );
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useCreateLedgerAccount() {
  return useSWRMutationClerk("create-ledger-account", CreateLedgerAccountFetcher);
}
