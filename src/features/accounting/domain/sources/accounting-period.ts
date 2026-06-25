import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { AccountingPeriodModel } from "@/features/accounting/data/models/accounting-period";
import { YearEndSummaryModel } from "@/features/accounting/data/models/year-end-summary";
import { PaginationMeta } from "@/core/resources/paginated";
import {
  ListPeriodsParams,
  ClosePeriodParams,
  ReopenPeriodParams,
  GetYearSummaryParams,
  CloseYearParams,
  ReopenYearParams,
} from "@/features/accounting/domain/repositories/accounting-period";
import { CloseWarning } from "@/features/accounting/domain/entities/close-warning";

export type ListPeriodsServiceResult = {
  data: AccountingPeriodModel[];
  meta: PaginationMeta;
};

export type ClosePeriodServiceResult = {
  period: AccountingPeriodModel;
  warnings: CloseWarning[];
};

export type GetYearSummaryServiceResult = YearEndSummaryModel;

export type CloseYearServiceResult = {
  closingJournalId: string;
  periods: AccountingPeriodModel[];
};

export type ReopenYearServiceResult = {
  reversalJournalId: string;
  periods: AccountingPeriodModel[];
};

export interface AccountingPeriodService {
  list(params: ListPeriodsParams, session: SessionEntity): Promise<ListPeriodsServiceResult>;
  close(params: ClosePeriodParams, session: SessionEntity): Promise<ClosePeriodServiceResult>;
  reopen(params: ReopenPeriodParams, session: SessionEntity): Promise<AccountingPeriodModel>;
  getYearSummary(params: GetYearSummaryParams, session: SessionEntity): Promise<GetYearSummaryServiceResult>;
  closeYear(params: CloseYearParams, session: SessionEntity): Promise<CloseYearServiceResult>;
  reopenYear(params: ReopenYearParams, session: SessionEntity): Promise<ReopenYearServiceResult>;
}
