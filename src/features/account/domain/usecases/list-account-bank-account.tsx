import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { AccountBankAccountEntity } from "@/features/account/domain/entities/account-bank-account";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { AccountRepository } from "@/features/account/domain/repositories/account";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class ListAccountBankAccountUseCase implements UseCase<DataState<AccountBankAccountEntity[]>, void> {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(): Promise<DataState<AccountBankAccountEntity[]>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) throw session.error;
      if (!session.data) return new DataFailed(new ServerError(ErrorCodes.INVALID_INSTANCE));

      const bankAccounts = await this.accountRepository.listBankAccount(session.data);
      if (bankAccounts instanceof DataFailed) throw bankAccounts.error;
      if (!bankAccounts.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      if (bankAccounts.data.length === 0) throw new ServerError(ErrorCodes.ACCOUNT_HAS_NO_BANK_ACCOUNT);
      return bankAccounts;
    } catch (err) {
      if (err instanceof ServerError) {
        // Expecting when we have NOT_FOUND error
        if (err.code === ErrorCodes.NOT_FOUND.code)
          return new DataFailed(new ServerError(ErrorCodes.ACCOUNT_HAS_NO_BANK_ACCOUNT));
        else return new DataFailed(err);
      } else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
