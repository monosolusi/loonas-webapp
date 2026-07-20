import { DataState } from "@/core/resources/data-state";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { AccountSettingAuditEntity } from "@/features/accounting/domain/entities/account-setting-audit";

export interface AccountSettingAuditRepository {
  list(params: { page?: number; limit?: number }, session: SessionEntity): Promise<DataState<PaginatedData<AccountSettingAuditEntity>>>;
}
