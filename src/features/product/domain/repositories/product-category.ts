import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ProductCategoryEntity } from "@/features/product/domain/entities/product-category";

export interface ProductCategoryRepository {
  list(search: string | undefined, session: SessionEntity): Promise<DataState<ProductCategoryEntity[]>>;
  create(name: string, session: SessionEntity): Promise<DataState<ProductCategoryEntity>>;
  delete(id: string, session: SessionEntity): Promise<DataState<void>>;
}
