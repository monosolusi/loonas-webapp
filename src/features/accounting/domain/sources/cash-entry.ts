import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CashEntryModel } from "@/features/accounting/data/models/cash-entry-model";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { PaginationMeta } from "@/core/resources/paginated";

export type ListCashEntriesServiceParams = {
  page?: number;
  limit?: number;
  direction?: CashEntryDirection;
  dateFrom?: string;
  dateTo?: string;
};

export type ListCashEntriesServiceResult = {
  data: CashEntryModel[];
  meta: PaginationMeta;
};

export type CreateCashEntryServiceParams = {
  direction: CashEntryDirection;
  amount: number;
  categoryId: string;
  date: string;
  idempotencyKey: string;
  note?: string | null;
};

export type GetCashEntryServiceParams = {
  id: string;
};

export type CancelCashEntryServiceParams = {
  id: string;
  idempotencyKey: string;
  note?: string | null;
};

export interface CashEntryService {
  list(params: ListCashEntriesServiceParams, session: SessionEntity): Promise<ListCashEntriesServiceResult>;
  create(params: CreateCashEntryServiceParams, session: SessionEntity): Promise<CashEntryModel>;
  get(params: GetCashEntryServiceParams, session: SessionEntity): Promise<CashEntryModel>;
  cancel(params: CancelCashEntryServiceParams, session: SessionEntity): Promise<CashEntryModel>;
}
