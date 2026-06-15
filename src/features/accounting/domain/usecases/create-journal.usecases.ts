import { UseCase } from "@/core/resources/use-case";
import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { SessionRepository } from "@/features/authentication/domain/repositories/session";
import { JournalEntity } from "@/features/accounting/domain/entities/journal";
import { WarningEntryEntity } from "@/features/accounting/domain/entities/warning-entry";
import { JournalRepository } from "@/features/accounting/domain/repositories/journal";

export type CreateJournalLineInput = {
  accountId: string;
  debit: number;
  credit: number;
};

export class CreateJournalUseCaseParams {
  constructor(
    public readonly postingDate: string,
    public readonly memo: string,
    public readonly lines: CreateJournalLineInput[],
    public readonly acknowledgedWarningCodes?: string[],
  ) {}
}

export type CreateJournalResult =
  | { kind: "success"; journal: JournalEntity; warnings: WarningEntryEntity[] }
  | { kind: "needs-acknowledge"; warnings: WarningEntryEntity[] };

export class CreateJournalUseCase implements UseCase<DataState<CreateJournalResult>, CreateJournalUseCaseParams> {
  constructor(
    private readonly repo: JournalRepository,
    private readonly sessionRepo: SessionRepository,
  ) {}

  public async execute(params: CreateJournalUseCaseParams): Promise<DataState<CreateJournalResult>> {
    try {
      const session = await this.resolveSession();
      const repoResult = await this.repo.create(
        {
          postingDate: params.postingDate,
          memo: params.memo,
          lines: params.lines,
          acknowledgedWarningCodes: params.acknowledgedWarningCodes,
        },
        session,
      );
      if (repoResult instanceof DataFailed) return repoResult;
      if (!repoResult.data) return new DataFailed(new ServerError(ErrorCodes.INVALID_INSTANCE));

      const { journal, warnings } = repoResult.data;
      return new DataSuccess(this.arbitrate(journal, warnings, params.acknowledgedWarningCodes ?? []));
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  private arbitrate(
    journal: JournalEntity,
    warnings: WarningEntryEntity[],
    ackCodes: string[],
  ): CreateJournalResult {
    const unacknowledgedHard = warnings.filter((w) => w.isHard && !ackCodes.includes(w.code));
    if (unacknowledgedHard.length > 0) {
      return { kind: "needs-acknowledge", warnings };
    }
    return { kind: "success", journal, warnings };
  }

  private async resolveSession(): Promise<SessionEntity> {
    const session = await this.sessionRepo.retrieve();
    if (session instanceof DataFailed) throw session.error;
    if (!session.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return session.data;
  }
}
