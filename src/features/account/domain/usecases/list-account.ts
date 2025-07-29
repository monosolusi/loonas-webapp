import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { AccountRepository } from "../repositories/account";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { AccountTypeEntity } from "@/features/account/domain/types/account-type";

export class ListAccountUseCase implements UseCase<DataState<AccountTypeEntity[]>, void> {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: void): Promise<DataState<AccountTypeEntity[]>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) throw session.error;
      if (session.data === undefined) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const accounts = await this.accountRepository.list(session.data);
      if (accounts instanceof DataFailed) throw accounts.error;
      if (accounts.data === undefined) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      if (accounts.data.length === 0) throw new ServerError(ErrorCodes.NOT_FOUND);

      return accounts;
    } catch (err: any) {
      return new DataFailed(err);
    }
  }
}
