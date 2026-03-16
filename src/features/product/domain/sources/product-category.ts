import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ProductCategoryModel } from "@/features/product/data/models/product-category";

export interface ProductCategoryService {
  list(search: string | undefined, session: SessionEntity): Promise<ProductCategoryModel[]>;
  create(name: string, session: SessionEntity): Promise<ProductCategoryModel>;
  delete(id: string, session: SessionEntity): Promise<void>;
}
