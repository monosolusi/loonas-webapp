import { BankAccountEntity } from "@/features/bank/domain/entities/bank-account";
import { CreatePartnerBankAccountFetcherParams } from "@/features/partner/presentation/hooks/use-create-partner-bank-account.types";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { BankRepositoryImpl } from "@/features/bank/data/repositories/bank";
import {
  CreateBankAccountUseCase,
  CreateBankAccountUseCaseParams,
} from "@/features/bank/domain/usecases/create-bank-account";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { BankServiceImpl } from "@/features/bank/data/sources/bank";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { DataFailed } from "@/core/resources/data-state";
import { useSWRMutationClerk } from "@/core/helpers/use-swr-mutation-clerk";

async function CreatePartnerBankAccountFetcher(
  _: string,
  { arg }: { arg: CreatePartnerBankAccountFetcherParams },
): Promise<BankAccountEntity> {
  if (!arg.bank?.id) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  if (!arg.accountNumber) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  if (!arg.accountHolderName) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  if (!arg.partner?.id) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  const sessionRepository = new SessionRepositoryImpl(new ClerkSessionService({ clerk: arg.clerk }));
  const bankRepository = new BankRepositoryImpl(new BankServiceImpl());
  const create = new CreateBankAccountUseCase(bankRepository, sessionRepository);
  const createParams = new CreateBankAccountUseCaseParams(
    arg.bank.id,
    arg.accountNumber,
    arg.accountHolderName,
    arg.partner.id,
  );

  const result = await create.execute(createParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  return result.data;
}

export function useCreatePartnerBankAccount() {
  return useSWRMutationClerk("create-partner-bank-account", CreatePartnerBankAccountFetcher);
}
