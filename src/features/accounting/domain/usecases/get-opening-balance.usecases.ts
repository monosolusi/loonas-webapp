import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { OpeningBalanceRepository } from "@/features/accounting/domain/repositories/opening-balance";
import { OpeningBalanceEntity } from "@/features/accounting/domain/entities/opening-balance";

export class GetOpeningBalanceUseCase implements UseCase<DataState<OpeningBalanceEntity | null>, void> {
  constructor(
    private readonly repo: OpeningBalanceRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(): Promise<DataState<OpeningBalanceEntity | null>> {
    try {
      const session = await this.resolveSession();
      return await this.fetchBalance(session);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private async resolveSession(): Promise<SessionEntity> {
    const session = await this.sessionRepo.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return session.data;
  }

  private async fetchBalance(session: SessionEntity): Promise<DataState<OpeningBalanceEntity | null>> {
    return this.repo.get(session);
  }
}
