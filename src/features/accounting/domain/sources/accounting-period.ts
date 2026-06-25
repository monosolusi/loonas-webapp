import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { AccountingPeriodModel } from "@/features/accounting/data/models/accounting-period";
import { PaginationMeta } from "@/core/resources/paginated";
import { ListPeriodsParams, ClosePeriodParams, ReopenPeriodParams } from "@/features/accounting/domain/repositories/accounting-period";
import { CloseWarning } from "@/features/accounting/domain/entities/close-warning";

export type ListPeriodsServiceResult = {
  data: AccountingPeriodModel[];
  meta: PaginationMeta;
};

export type ClosePeriodServiceResult = {
  period: AccountingPeriodModel;
  warnings: CloseWarning[];
};

export interface AccountingPeriodService {
  list(params: ListPeriodsParams, session: SessionEntity): Promise<ListPeriodsServiceResult>;
  close(params: ClosePeriodParams, session: SessionEntity): Promise<ClosePeriodServiceResult>;
  reopen(params: ReopenPeriodParams, session: SessionEntity): Promise<AccountingPeriodModel>;
}
