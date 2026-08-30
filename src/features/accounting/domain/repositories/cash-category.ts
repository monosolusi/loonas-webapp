import { DataState } from "@/core/resources/data-state";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CashCategoryEntity } from "@/features/accounting/domain/entities/cash-category";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";

export type ListCashCategoriesParams = {
  direction?: CashEntryDirection;
};

export type CreateCashCategoryParams = {
  name: string;
  accountId: string;
  direction: CashEntryDirection;
};

/** Partial update — omitted fields are left unchanged. */
export type UpdateCashCategoryParams = {
  id: string;
  name?: string;
  accountId?: string;
};

export type DeleteCashCategoryParams = {
  id: string;
};

export interface CashCategoryRepository {
  list(params: ListCashCategoriesParams, session: SessionEntity): Promise<DataState<PaginatedData<CashCategoryEntity>>>;
  create(params: CreateCashCategoryParams, session: SessionEntity): Promise<DataState<CashCategoryEntity>>;
  update(params: UpdateCashCategoryParams, session: SessionEntity): Promise<DataState<CashCategoryEntity>>;
  delete(params: DeleteCashCategoryParams, session: SessionEntity): Promise<DataState<void>>;
}
