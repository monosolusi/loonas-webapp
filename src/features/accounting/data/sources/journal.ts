import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { JournalModel } from "@/features/accounting/data/models/journal";
import { JournalWriteResultModel } from "@/features/accounting/data/models/journal-write-result";
import {
  JournalService,
  JournalWriteServiceResult,
  ListJournalsServiceResult,
  ListJournalsServiceParams,
  CreateJournalServiceParams,
  GetJournalServiceParams,
  ReverseJournalServiceParams,
} from "@/features/accounting/domain/sources/journal";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class JournalServiceImpl implements JournalService {
  constructor(private readonly http: HttpRequest) {}

  public async list(params: ListJournalsServiceParams, session: SessionEntity): Promise<ListJournalsServiceResult> {
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

  public async create(params: CreateJournalServiceParams, session: SessionEntity): Promise<JournalWriteServiceResult> {
    try {
      const body: Record<string, any> = {
        posting_date: params.postingDate,
        memo: params.memo,
        lines: params.lines.map((l) => ({ account_id: l.accountId, debit: l.debit, credit: l.credit })),
      };
      if (params.acknowledgedWarningCodes && params.acknowledgedWarningCodes.length > 0) {
        body["acknowledged_warning_codes"] = params.acknowledgedWarningCodes;
      }

      const result = await this.http.request(
        { path: "/accounting/journals", method: "POST", body, session },
        { headers: params.idempotencyKey ? { "Idempotency-Key": params.idempotencyKey } : {} },
      );
      const envelope = JournalWriteResultModel.fromJson(result);
      return { journal: envelope.journal, warnings: envelope.warnings };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async get(params: GetJournalServiceParams, session: SessionEntity): Promise<JournalModel> {
    try {
      const result = await this.http.request({
        path: `/accounting/journals/${params.id}`,
        method: "GET",
        session,
      });
      if (!result?.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return JournalModel.fromJson(result.data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async reverse(params: ReverseJournalServiceParams, session: SessionEntity): Promise<JournalWriteServiceResult> {
    try {
      const body: Record<string, any> = {
        change_reason_category: params.changeReasonCategory,
        change_reason_detail: params.changeReasonDetail,
      };
      if (params.postingDate !== undefined) {
        body["posting_date"] = params.postingDate;
      }
      if (params.acknowledgedWarningCodes && params.acknowledgedWarningCodes.length > 0) {
        body["acknowledged_warning_codes"] = params.acknowledgedWarningCodes;
      }

      const result = await this.http.request(
        { path: `/accounting/journals/${params.id}/reverse`, method: "POST", body, session },
        { headers: params.idempotencyKey ? { "Idempotency-Key": params.idempotencyKey } : {} },
      );
      const envelope = JournalWriteResultModel.fromJson(result);
      return { journal: envelope.journal, warnings: envelope.warnings };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
