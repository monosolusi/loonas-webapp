import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { AccountSettingAuditEntity } from "@/features/accounting/domain/entities/account-setting-audit";
import { AccountSettingAuditRepository } from "@/features/accounting/domain/repositories/account-setting-audit";
import { AccountSettingAuditService } from "@/features/accounting/domain/sources/account-setting-audit";

export class AccountSettingAuditRepositoryImpl implements AccountSettingAuditRepository {
  constructor(private readonly service: AccountSettingAuditService) {}

  public async list(
    params: { page?: number; limit?: number },
    session: SessionEntity,
  ): Promise<DataState<PaginatedData<AccountSettingAuditEntity>>> {
    try {
      const result = await this.service.list(params, session);
      return new DataSuccess({
        data: result.data.map((m) => m.toEntity()),
        meta: result.meta,
      });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
