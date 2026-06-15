import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { JournalEntity } from "@/features/accounting/domain/entities/journal";
import {
  JournalRepository,
  ListJournalsParams,
  ListJournalsResult,
  CreateJournalParams,
  GetJournalParams,
  JournalWriteResult,
  ReverseJournalParams,
} from "@/features/accounting/domain/repositories/journal";
import { JournalService } from "@/features/accounting/domain/sources/journal";

export class JournalRepositoryImpl implements JournalRepository {
  constructor(private readonly service: JournalService) {}

  public async list(params: ListJournalsParams, session: SessionEntity): Promise<DataState<ListJournalsResult>> {
    try {
      const result = await this.service.list(params, session);
      return new DataSuccess({ journals: result.data.map((m) => m.toEntity()), meta: result.meta });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async create(params: CreateJournalParams, session: SessionEntity): Promise<DataState<JournalWriteResult>> {
    try {
      const result = await this.service.create(params, session);
      return new DataSuccess({
        journal: result.journal.toEntity(),
        warnings: result.warnings.map((w) => w.toEntity()),
      });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async get(params: GetJournalParams, session: SessionEntity): Promise<DataState<JournalEntity>> {
    try {
      const model = await this.service.get(params, session);
      return new DataSuccess(model.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async reverse(params: ReverseJournalParams, session: SessionEntity): Promise<DataState<JournalWriteResult>> {
    try {
      const result = await this.service.reverse(params, session);
      return new DataSuccess({
        journal: result.journal.toEntity(),
        warnings: result.warnings.map((w) => w.toEntity()),
      });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
