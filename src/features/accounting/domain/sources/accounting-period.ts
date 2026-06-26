import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { AccountingPeriodModel } from "@/features/accounting/data/models/accounting-period";
import { YearEndSummaryModel } from "@/features/accounting/data/models/year-end-summary";
import { PaginationMeta } from "@/core/resources/paginated";
import { CloseWarning } from "@/features/accounting/domain/entities/close-warning";

export type ListPeriodsServiceParams = {
  page?: number;
  limit?: number;
  status?: "open" | "closed";
};

export type ClosePeriodServiceParams = {
  id: string;
  reason?: string;
  idempotencyKey: string;
};

export type ReopenPeriodServiceParams = {
  id: string;
  reason: string;
  idempotencyKey: string;
};

export type GetYearSummaryServiceParams = {
  year: number;
};

export type CloseYearServiceParams = {
  year: number;
  retainedEarningsAccountId?: string;
  idempotencyKey: string;
};

export type ReopenYearServiceParams = {
  year: number;
  confirmationToken: string;
  reason: string;
  idempotencyKey: string;
};

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
  list(params: ListPeriodsServiceParams, session: SessionEntity): Promise<ListPeriodsServiceResult>;
  close(params: ClosePeriodServiceParams, session: SessionEntity): Promise<ClosePeriodServiceResult>;
  reopen(params: ReopenPeriodServiceParams, session: SessionEntity): Promise<AccountingPeriodModel>;
  getYearSummary(params: GetYearSummaryServiceParams, session: SessionEntity): Promise<GetYearSummaryServiceResult>;
  closeYear(params: CloseYearServiceParams, session: SessionEntity): Promise<CloseYearServiceResult>;
  reopenYear(params: ReopenYearServiceParams, session: SessionEntity): Promise<ReopenYearServiceResult>;
}
