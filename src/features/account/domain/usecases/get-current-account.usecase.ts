import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { AccountTypeEntity } from "@/features/account/domain/types/account-type";
import { AccountRepository } from "@/features/account/domain/repositories/account";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class GetCurrentAccountUseCase implements UseCase<DataState<AccountTypeEntity>, void> {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(): Promise<DataState<AccountTypeEntity>> {
    try {
      const session = await this.retrieveSession();
      return this.accountRepository.getCurrent(session);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async retrieveSession() {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.NO_VALID_SESSION);
    return session.data;
  }
}
