import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ProductEntity } from "@/features/product/domain/entities/product";
import { ProductPhotoEntity } from "@/features/product/domain/entities/product-photo";
import { RecipeItemEntity } from "@/features/product/domain/entities/recipe-item";

export type CreateProductParams = {
  name: string;
  sku: string;
  type: string;
  productionMode?: string | null;
  status?: string;
  categoryId?: string;
  variants: { name: string; sku?: string; price: number }[];
};

export type UpdateProductParams = {
  name?: string;
  sku?: string;
  type?: string;
  productionMode?: string | null;
  status?: string;
  categoryId?: string | null;
};

export type ListProductsParams = {
  page?: number;
  limit?: number;
  type?: string;
  categoryIds?: string[];
  status?: string;
  search?: string;
};

export type ListProductsResult = {
  products: ProductEntity[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export type AddVariantParams = {
  name: string;
  sku?: string;
  price: number;
};

export type UpdateVariantParams = {
  name?: string;
  sku?: string;
  price?: number;
};

export type SaveRecipeParams = {
  items: { rawMaterialId: string; quantity: number }[];
};

export interface ProductRepository {
  list(params: ListProductsParams, session: SessionEntity): Promise<DataState<ListProductsResult>>;
  get(id: string, session: SessionEntity): Promise<DataState<ProductEntity>>;
  create(params: CreateProductParams, session: SessionEntity): Promise<DataState<ProductEntity>>;
  update(id: string, params: UpdateProductParams, session: SessionEntity): Promise<DataState<ProductEntity>>;
  delete(id: string, session: SessionEntity): Promise<DataState<void>>;
  uploadPhoto(productId: string, file: File, session: SessionEntity): Promise<DataState<ProductPhotoEntity>>;
  deletePhoto(productId: string, photoId: string, session: SessionEntity): Promise<DataState<void>>;
  addVariant(productId: string, params: AddVariantParams, session: SessionEntity): Promise<DataState<void>>;
  updateVariant(productId: string, variantId: string, params: UpdateVariantParams, session: SessionEntity): Promise<DataState<void>>;
  deleteVariant(productId: string, variantId: string, session: SessionEntity): Promise<DataState<void>>;
  getRecipe(productId: string, variantId: string, session: SessionEntity): Promise<DataState<RecipeItemEntity[]>>;
  saveRecipe(productId: string, variantId: string, params: SaveRecipeParams, session: SessionEntity): Promise<DataState<void>>;
}
