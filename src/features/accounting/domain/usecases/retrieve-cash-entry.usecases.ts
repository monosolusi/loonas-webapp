import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { CashEntryEntity } from "@/features/accounting/domain/entities/cash-entry";
import { CashEntryRepository } from "@/features/accounting/domain/repositories/cash-entry";

export class RetrieveCashEntryUseCaseParams {
  constructor(public readonly id: string) {}
}

export class RetrieveCashEntryUseCase implements UseCase<DataState<CashEntryEntity>, RetrieveCashEntryUseCaseParams> {
  constructor(
    private readonly repo: CashEntryRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: RetrieveCashEntryUseCaseParams): Promise<DataState<CashEntryEntity>> {
    try {
      const session = await this.resolveSession();
      return await this.repo.get({ id: params.id }, session);
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
}
