import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { BankServiceImpl } from "@/features/bank/data/sources/bank";
import { BankRepositoryImpl } from "@/features/bank/data/repositories/bank";
import {
  VerifyAccountHolderUseCase,
  VerifyAccountHolderUseCaseParams,
} from "@/features/bank/domain/usecases/verify-account-holder";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { AccountInquiryResultEntity } from "@/features/bank/domain/entities/account-inquiry-result";
import { VerifyBankAccountFetcherParams } from "@/features/bank/presentation/hooks/use-inquiry-bank-account.types";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";

async function VerifyBankAccountFetcher(
  _: string,
  { arg }: { arg: VerifyBankAccountFetcherParams },
): Promise<AccountInquiryResultEntity> {
  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const bankRepository = new BankRepositoryImpl(new BankServiceImpl());
  const verifyAccountHolder = new VerifyAccountHolderUseCase(bankRepository, sessionRepository);
  const params = new VerifyAccountHolderUseCaseParams(arg.bankId, arg.accountNumber);

  const result = await verifyAccountHolder.execute(params);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useInquiryBankAccount() {
  return useSWRMutationClerk("inquiry-bank-account", VerifyBankAccountFetcher);
}
