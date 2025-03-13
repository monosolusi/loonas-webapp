import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { AccountVerificationWorkEntity } from "@/app/(account)/_domain/_entities/account-verification-work";
import { AccountRepository } from "@/app/(account)/_domain/_repositories/account";
import { SessionRepository } from "@/app/(authentication)/_domain/_repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class RetrieveAccountVerificationWorkUseCaseParams {
  constructor(public readonly accountId: string) {
  }
}

export class RetrieveAccountVerificationWorkUseCase implements UseCase<DataState<AccountVerificationWorkEntity>, RetrieveAccountVerificationWorkUseCaseParams> {

  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly sessionRepository: SessionRepository
  ) {
  }

  public async execute(params: RetrieveAccountVerificationWorkUseCaseParams): Promise<DataState<AccountVerificationWorkEntity>> {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) return session;
    if (!session.data) return new DataFailed(new ServerError(ErrorCodes.INVALID_INSTANCE));

    return this.accountRepository.retrieveVerificationWork(params.accountId, session.data);
  }

}