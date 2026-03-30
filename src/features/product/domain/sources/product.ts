import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ProductModel } from "@/features/product/data/models/product";
import { ProductPhotoModel } from "@/features/product/data/models/product-photo";
import { RecipeItemModel } from "@/features/product/data/models/recipe-item";
import {
  CreateProductParams,
  UpdateProductParams,
  ListProductsParams,
  AddVariantParams,
  UpdateVariantParams,
  SaveRecipeParams,
} from "@/features/product/domain/repositories/product";

export type ListProductsServiceResult = {
  data: ProductModel[];
  meta: { page: number; limit: number; total: number; totalPages: number };
};

export interface ProductService {
  list(params: ListProductsParams, session: SessionEntity): Promise<ListProductsServiceResult>;
  get(id: string, session: SessionEntity): Promise<ProductModel>;
  create(params: CreateProductParams, session: SessionEntity): Promise<ProductModel>;
  update(id: string, params: UpdateProductParams, session: SessionEntity): Promise<ProductModel>;
  delete(id: string, session: SessionEntity): Promise<void>;
  uploadPhoto(productId: string, file: File, session: SessionEntity): Promise<ProductPhotoModel>;
  deletePhoto(productId: string, photoId: string, session: SessionEntity): Promise<void>;
  addVariant(productId: string, params: AddVariantParams, session: SessionEntity): Promise<void>;
  updateVariant(productId: string, variantId: string, params: UpdateVariantParams, session: SessionEntity): Promise<void>;
  deleteVariant(productId: string, variantId: string, session: SessionEntity): Promise<void>;
  getRecipe(productId: string, variantId: string, session: SessionEntity): Promise<RecipeItemModel[]>;
  saveRecipe(productId: string, variantId: string, params: SaveRecipeParams, session: SessionEntity): Promise<void>;
}
