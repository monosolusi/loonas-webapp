import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { PersonalAccountEntity } from "@/app/(account)/_domain/_entities/personal-account";
import { AccountRepository } from "../_repositories/account";
import { SessionRepository } from "@/app/(authentication)/_domain/_repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class ListAccountUseCase implements UseCase<DataState<PersonalAccountEntity[]>, void> {

  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly sessionRepository: SessionRepository
  ) {
  }

  public async execute(params: void): Promise<DataState<PersonalAccountEntity[]>> {
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