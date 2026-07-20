"use client";

import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { BankServiceImpl } from "@/features/bank/data/sources/bank";
import { BankRepositoryImpl } from "@/features/bank/data/repositories/bank";
import { DataFailed } from "@/core/resources/data-state";
import {
  CreateAccountBankAccountUseCase,
  CreateAccountBankAccountUseCaseParams,
} from "@/features/bank/domain/usecases/create-account-bank-account";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { useClerk } from "@clerk/nextjs";

type CreateAccountBankAccountParams = Record<string, unknown> & {
  bankId: string;
  accountNumber: string;
};

async function createAccountBankAccountFetcher(
  _: string,
  { arg }: { arg: CreateAccountBankAccountParams & { clerk: ReturnType<typeof useClerk> } },
): Promise<void> {
  const sessionService = new ClerkSessionService({ clerk: arg.clerk });
  const sessionRepository = new SessionRepositoryImpl(sessionService);
  const bankService = new BankServiceImpl();
  const bankRepository = new BankRepositoryImpl(bankService);
  const create = new CreateAccountBankAccountUseCase(bankRepository, sessionRepository);
  const createParams = new CreateAccountBankAccountUseCaseParams({
    bankId: arg.bankId,
    accountNumber: arg.accountNumber,
  });

  const result = await create.execute(createParams);
  if (result instanceof DataFailed) throw result.error;
}

export function useCreateAccountBankAccount() {
  return useSWRMutationClerk("create-account-bank-account", createAccountBankAccountFetcher);
}
