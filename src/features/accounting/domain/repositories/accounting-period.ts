import { DataState } from "@/core/resources/data-state";
import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { AccountingPeriodEntity } from "@/features/accounting/domain/entities/accounting-period";
import { ClosePeriodResult } from "@/features/accounting/domain/entities/close-warning";
import { YearEndSummaryEntity } from "@/features/accounting/domain/entities/year-end-summary";
import { RetryFailedPostingsResult } from "@/features/accounting/domain/entities/retry-failed-postings-result";

export type ListPeriodsParams = {
  page?: number;
  limit?: number;
  status?: "open" | "closed";
};

export type ListPeriodsResult = {
  data: AccountingPeriodEntity[];
  meta: PaginationMeta;
};

export type GetPeriodParams = {
  id: string;
};

export type ClosePeriodParams = {
  id: string;
  reason?: string;
  idempotencyKey: string;
};

export type ReopenPeriodParams = {
  id: string;
  reason: string;
  idempotencyKey: string;
};

export type GetYearSummaryParams = {
  year: number;
};

export type CloseYearParams = {
  year: number;
  retainedEarningsAccountId?: string;
  idempotencyKey: string;
};

export type ReopenYearParams = {
  year: number;
  confirmationToken: string;
  reason: string;
  idempotencyKey: string;
};

export type CloseYearResult = {
  closingJournalId: string;
  periods: AccountingPeriodEntity[];
};

export type ReopenYearResult = {
  reversalJournalId: string;
  periods: AccountingPeriodEntity[];
};

export type RetryFailedPostingsParams = {
  id: string;
};

export interface AccountingPeriodRepository {
  list(params: ListPeriodsParams, session: SessionEntity): Promise<DataState<ListPeriodsResult>>;
  close(params: ClosePeriodParams, session: SessionEntity): Promise<DataState<ClosePeriodResult>>;
  reopen(params: ReopenPeriodParams, session: SessionEntity): Promise<DataState<AccountingPeriodEntity>>;
  getYearSummary(params: GetYearSummaryParams, session: SessionEntity): Promise<DataState<YearEndSummaryEntity>>;
  closeYear(params: CloseYearParams, session: SessionEntity): Promise<DataState<CloseYearResult>>;
  reopenYear(params: ReopenYearParams, session: SessionEntity): Promise<DataState<ReopenYearResult>>;
  retryFailedPostings(params: RetryFailedPostingsParams, session: SessionEntity): Promise<DataState<RetryFailedPostingsResult>>;
}
