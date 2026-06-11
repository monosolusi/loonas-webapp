import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { JournalModel } from "@/features/accounting/data/models/journal";
import { JournalService, ListJournalsServiceResult } from "@/features/accounting/domain/sources/journal";
import { ListJournalsParams } from "@/features/accounting/domain/repositories/journal";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class JournalServiceImpl implements JournalService {
  constructor(private readonly http: HttpRequest) {}

  public async list(params: ListJournalsParams, session: SessionEntity): Promise<ListJournalsServiceResult> {
    try {
      const searchParams: Record<string, any> = {};
      if (params.page) searchParams["page"] = String(params.page);
      if (params.limit) searchParams["limit"] = String(params.limit);
      if (params.search) searchParams["search"] = params.search;

      const result = await this.http.request({ path: "/accounting/journals", method: "GET", searchParams, session });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return {
        data: items.map(JournalModel.fromJson),
        meta: {
          page: result.meta?.page ?? 1,
          limit: result.meta?.limit ?? 25,
          total: result.meta?.total ?? 0,
          totalPages: result.meta?.total_pages ?? 1,
        },
      };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
