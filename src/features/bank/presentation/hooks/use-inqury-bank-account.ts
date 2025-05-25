import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { BankServiceImpl } from "@/features/bank/data/sources/bank";
import { BankRepositoryImpl } from "@/features/bank/data/repositories/bank";
import {
  VerifyAccountHolderUseCase,
  VerifyAccountHolderUseCaseParams
} from "@/features/bank/domain/usecases/verify-account-holder";
import { DataFailed } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { AccountInquiryResultEntity } from "@/features/bank/domain/entities/account-inquiry-result";
import useSWRMutation from "swr/mutation";

async function verifyBankAccountFetcher(
  _: string,
  { arg }: { arg: { bankId: string, accountNumber: string } }
): Promise<AccountInquiryResultEntity> {
  const sessionService = new LocalStorageSessionService();
  const sessionRepository = new SessionRepositoryImpl(sessionService);
  const bankService = new BankServiceImpl();
  const bankRepository = new BankRepositoryImpl(bankService);
  const verifyAccountHolder = new VerifyAccountHolderUseCase(bankRepository, sessionRepository);
  const params = new VerifyAccountHolderUseCaseParams(arg.bankId, arg.accountNumber);

  const result = await verifyAccountHolder.execute(params);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useInquiryBankAccount() {
  return useSWRMutation("inquiry-bank-account", verifyBankAccountFetcher);
}
