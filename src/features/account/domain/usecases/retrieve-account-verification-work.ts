/**
 * I created this under the assumption that the account feature should have verification functionality as well
 * However, I later found out that, it should be better to separate the account features with verification features.
 * TODO: Move this to verification folder
 */
import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { AccountVerificationWorkEntity } from "../entities/account-verification-work";
import { AccountRepository } from "../repositories/account";

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