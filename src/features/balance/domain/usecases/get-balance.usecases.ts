import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { BalanceEntity } from "@/features/balance/domain/entities/balance";
import { BalanceRepository } from "@/features/balance/domain/repositories/balance";

export class GetBalanceUseCase implements UseCase<DataState<BalanceEntity>> {
  constructor(
    private readonly balanceRepository: BalanceRepository,
    private readonly sessionRepository: SessionRepository,
  ) {}

  public async execute(): Promise<DataState<BalanceEntity>> {
    try {
      const session = await this.resolveSession();
      return await this.balanceRepository.get(session);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async resolveSession(): Promise<SessionEntity> {
    const session = await this.sessionRepository.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return session.data;
  }
}
