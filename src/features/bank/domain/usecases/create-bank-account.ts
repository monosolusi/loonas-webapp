import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { BankRepository } from "../repositories/bank";
import { BankAccountEntity } from "../entities/bank";

export class CreateBankAccountUseCaseParams {
  constructor(
    public readonly bankId: string,
    public readonly accountNumber: string,
    public readonly accountHolderName: string,
    public readonly partnerId: string
  ) {}
}

export class CreateBankAccountUseCase implements UseCase<DataState<BankAccountEntity>, CreateBankAccountUseCaseParams> {
  constructor(
    public readonly bankRepository: BankRepository,
    public readonly sessionRepository: SessionRepository
  ) {
  }

  public async execute(params: CreateBankAccountUseCaseParams): Promise<DataState<BankAccountEntity>> {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) return session;
    if (!session.data) return new DataFailed(new ServerError(ErrorCodes.INVALID_INSTANCE));

    try {
      const bankAccount = await this.bankRepository.createBankAccount(
        params.bankId,
        params.accountNumber,
        params.accountHolderName,
        params.partnerId,
        session.data
      );
      return new DataSuccess(bankAccount);
    } catch (error) {
      if (error instanceof ServerError) {
        return new DataFailed(error);
      }
      return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error }));
    }
  }
}