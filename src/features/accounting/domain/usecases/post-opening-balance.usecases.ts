import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { JournalEntity } from "@/features/accounting/domain/entities/journal";
import { OpeningBalanceRepository } from "@/features/accounting/domain/repositories/opening-balance";

export type PostOpeningBalanceLineInput = {
  accountId: string;
  debit: number;
  credit: number;
};

export class PostOpeningBalanceUseCaseParams {
  constructor(
    public readonly asOf: string,
    public readonly lines: PostOpeningBalanceLineInput[],
    public readonly idempotencyKey: string,
  ) {}
}

export class PostOpeningBalanceUseCase
  implements UseCase<DataState<JournalEntity>, PostOpeningBalanceUseCaseParams>
{
  constructor(
    private readonly repo: OpeningBalanceRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: PostOpeningBalanceUseCaseParams): Promise<DataState<JournalEntity>> {
    try {
      const session = await this.resolveSession();
      return new DataSuccess(await this.postBalance(params, session));
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

  private async postBalance(
    params: PostOpeningBalanceUseCaseParams,
    session: SessionEntity,
  ): Promise<JournalEntity> {
    const result = await this.repo.post(
      {
        asOf: params.asOf,
        lines: params.lines.map((l) => ({ accountId: l.accountId, debit: l.debit, credit: l.credit })),
        idempotencyKey: params.idempotencyKey,
      },
      session,
    );
    if (result instanceof DataFailed) throw result.error;
    if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return result.data;
  }
}
