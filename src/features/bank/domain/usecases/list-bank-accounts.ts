import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { BankAccountEntity } from "@/features/bank/domain/entities/bank-account";
import { BankRepository } from "@/features/bank/domain/repositories/bank";

export class ListBankAccountsUseCaseParams {
  constructor(public readonly partnerId: string) {
  }
}

export class ListBankAccountsUseCase implements UseCase<DataState<BankAccountEntity[]>, ListBankAccountsUseCaseParams> {
  constructor(
    public readonly bankRepository: BankRepository,
    public readonly sessionRepository: SessionRepository
  ) {
  }

  public async execute(params: ListBankAccountsUseCaseParams): Promise<DataState<BankAccountEntity[]>> {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) return session;
    if (!session.data) return new DataFailed(new ServerError(ErrorCodes.INVALID_INSTANCE));

    return this.bankRepository.listBankAccounts(params.partnerId, session.data);
  }
}