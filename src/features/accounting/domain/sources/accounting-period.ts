import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { AccountingPeriodModel } from "@/features/accounting/data/models/accounting-period";
import { PaginationMeta } from "@/core/resources/paginated";
import { ListPeriodsParams, ClosePeriodParams, ReopenPeriodParams } from "@/features/accounting/domain/repositories/accounting-period";

export type ListPeriodsServiceResult = {
  data: AccountingPeriodModel[];
  meta: PaginationMeta;
};

export interface AccountingPeriodService {
  list(params: ListPeriodsParams, session: SessionEntity): Promise<ListPeriodsServiceResult>;
  close(params: ClosePeriodParams, session: SessionEntity): Promise<AccountingPeriodModel>;
  reopen(params: ReopenPeriodParams, session: SessionEntity): Promise<AccountingPeriodModel>;
}
