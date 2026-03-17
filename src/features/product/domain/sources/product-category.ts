import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ProductCategoryModel } from "@/features/product/data/models/product-category";
import { PaginationMeta } from "@/core/resources/paginated";

export type ListCategoriesServiceResult = {
  data: ProductCategoryModel[];
  meta: PaginationMeta;
};

export type ListCategoriesParams = {
  search?: string;
  page?: number;
  limit?: number;
};

export interface ProductCategoryService {
  list(search: string | undefined, session: SessionEntity): Promise<ProductCategoryModel[]>;
  listPaginated(params: ListCategoriesParams, session: SessionEntity): Promise<ListCategoriesServiceResult>;
  create(name: string, session: SessionEntity): Promise<ProductCategoryModel>;
  update(id: string, name: string, session: SessionEntity): Promise<ProductCategoryModel>;
  delete(id: string, session: SessionEntity): Promise<void>;
}
