import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { AccountSettingAuditModel } from "@/features/accounting/data/models/account-setting-audit";
import { AccountSettingAuditService, ListAccountSettingAuditServiceResult } from "@/features/accounting/domain/sources/account-setting-audit";

export class AccountSettingAuditServiceImpl implements AccountSettingAuditService {
  constructor(private readonly http: HttpRequest) {}

  public async list(
    params: { page?: number; limit?: number },
    session: SessionEntity,
  ): Promise<ListAccountSettingAuditServiceResult> {
    try {
      const searchParams: Record<string, any> = {};
      if (params.page != null) searchParams["page"] = String(params.page);
      if (params.limit != null) searchParams["limit"] = String(params.limit);

      const result = await this.http.request({
        path: "/accounting/account-settings/audit",
        method: "GET",
        searchParams,
        session,
      });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return {
        data: items.map(AccountSettingAuditModel.fromJson),
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
