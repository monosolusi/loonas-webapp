import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { AccountSettingAuditModel } from "@/features/accounting/data/models/account-setting-audit";
import { PaginationMeta } from "@/core/resources/paginated";

export type ListAccountSettingAuditServiceResult = {
  data: AccountSettingAuditModel[];
  meta: PaginationMeta;
};

export interface AccountSettingAuditService {
  list(params: { page?: number; limit?: number }, session: SessionEntity): Promise<ListAccountSettingAuditServiceResult>;
}
