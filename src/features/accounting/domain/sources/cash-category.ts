import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CashCategoryModel } from "@/features/accounting/data/models/cash-category-model";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";

export type ListCashCategoriesServiceParams = {
  direction?: CashEntryDirection;
};

export type ListCashCategoriesServiceResult = {
  data: CashCategoryModel[];
  meta: PaginationMeta;
};

export type CreateCashCategoryServiceParams = {
  name: string;
  accountId: string;
  direction: CashEntryDirection;
};

/** Partial update — omitted fields are left unchanged, so the body is built key by key. */
export type UpdateCashCategoryServiceParams = {
  id: string;
  name?: string;
  accountId?: string;
};

export type DeleteCashCategoryServiceParams = {
  id: string;
};

export interface CashCategoryService {
  list(params: ListCashCategoriesServiceParams, session: SessionEntity): Promise<ListCashCategoriesServiceResult>;
  create(params: CreateCashCategoryServiceParams, session: SessionEntity): Promise<CashCategoryModel>;
  update(params: UpdateCashCategoryServiceParams, session: SessionEntity): Promise<CashCategoryModel>;
  delete(params: DeleteCashCategoryServiceParams, session: SessionEntity): Promise<void>;
}
