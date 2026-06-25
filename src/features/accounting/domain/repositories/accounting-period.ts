import { DataState } from "@/core/resources/data-state";
import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { AccountingPeriodEntity } from "@/features/accounting/domain/entities/accounting-period";
import { ClosePeriodResult } from "@/features/accounting/domain/entities/close-warning";

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

export interface AccountingPeriodRepository {
  list(params: ListPeriodsParams, session: SessionEntity): Promise<DataState<ListPeriodsResult>>;
  close(params: ClosePeriodParams, session: SessionEntity): Promise<DataState<ClosePeriodResult>>;
  reopen(params: ReopenPeriodParams, session: SessionEntity): Promise<DataState<AccountingPeriodEntity>>;
}
