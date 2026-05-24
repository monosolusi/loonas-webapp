import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { BankRepository } from "@/features/bank/domain/repositories/bank";
import { BankEntity } from "@/features/bank/domain/entities/bank";

export class ListBanksUseCase implements UseCase<DataState<BankEntity[]>, void> {
  constructor(
    public readonly bankRepository: BankRepository,
    public readonly sessionRepository: SessionRepository
  ) {
  }

  public async execute(): Promise<DataState<BankEntity[]>> {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) return session;
    if (!session.data) return new DataFailed(new ServerError(ErrorCodes.INVALID_INSTANCE));

    return this.bankRepository.listBanks(session.data);
  }
}