import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { JournalRepository, ListJournalsParams, ListJournalsResult } from "@/features/accounting/domain/repositories/journal";
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
}
