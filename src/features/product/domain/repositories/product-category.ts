import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ProductCategoryEntity } from "@/features/product/domain/entities/product-category";
import { PaginationMeta } from "@/core/resources/paginated";
import { ListCategoriesParams } from "@/features/product/domain/sources/product-category";

export type ListCategoriesResult = {
  categories: ProductCategoryEntity[];
  meta: PaginationMeta;
};

export interface ProductCategoryRepository {
  list(search: string | undefined, session: SessionEntity): Promise<DataState<ProductCategoryEntity[]>>;
  listPaginated(params: ListCategoriesParams, session: SessionEntity): Promise<DataState<ListCategoriesResult>>;
  create(name: string, session: SessionEntity): Promise<DataState<ProductCategoryEntity>>;
  update(id: string, name: string, session: SessionEntity): Promise<DataState<ProductCategoryEntity>>;
  delete(id: string, session: SessionEntity): Promise<DataState<void>>;
}
