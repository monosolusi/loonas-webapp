import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { BankRepository } from "@/features/bank/domain/repositories/bank";

interface CreateAccountBankAccountUseCaseParamsConstructor {
  bankId: string;
  accountNumber: string;
}

export class CreateAccountBankAccountUseCaseParams {
  public bankId: string;
  public accountNumber: string;

  constructor(args: CreateAccountBankAccountUseCaseParamsConstructor) {
    this.bankId = args.bankId;
    this.accountNumber = args.accountNumber;
  }
}

export class CreateAccountBankAccountUseCase
  implements UseCase<DataState<void>, CreateAccountBankAccountUseCaseParams>
{
  constructor(
    public readonly bankRepository: BankRepository,
    public readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(params: CreateAccountBankAccountUseCaseParams): Promise<DataState<void>> {
    try {
      const session = await this.sessionRepository.retrieve();
      if (session instanceof DataFailed) return session;
      if (!session.data) return new DataFailed(new ServerError(ErrorCodes.INVALID_INSTANCE));

      const cBankAccount = await this.bankRepository.createBankAccountForAccount(
        {
          bankId: params.bankId,
          accountNumber: params.accountNumber,
        },
        session.data,
      );

      if (cBankAccount instanceof DataFailed) throw cBankAccount.error;
      return cBankAccount;
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
