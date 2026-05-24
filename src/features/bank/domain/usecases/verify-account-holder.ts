import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { BankRepository } from "@/features/bank/domain/repositories/bank";
import { AccountInquiryResultEntity } from "@/features/bank/domain/entities/account-inquiry-result";

export class VerifyAccountHolderUseCaseParams {
  constructor(
    public readonly bankId: string,
    public readonly accountNumber: string
  ) {
  }
}

export class VerifyAccountHolderUseCase implements UseCase<DataState<AccountInquiryResultEntity>, VerifyAccountHolderUseCaseParams> {
  constructor(
    public readonly bankRepository: BankRepository,
    public readonly sessionRepository: SessionRepository
  ) {
  }

  public async execute(params: VerifyAccountHolderUseCaseParams): Promise<DataState<AccountInquiryResultEntity>> {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) return session;
    if (!session.data) return new DataFailed(new ServerError(ErrorCodes.INVALID_INSTANCE));

    return await this.bankRepository.verifyAccountHolder(
      params.bankId,
      params.accountNumber,
      session.data
    );
  }
}