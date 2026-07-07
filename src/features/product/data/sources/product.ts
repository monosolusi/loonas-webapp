import { HttpRequest } from "@/core/helpers/http-request";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ProductModel } from "@/features/product/data/models/product";
import { ProductForSaleModel } from "@/features/product/data/models/product-for-sale";
import { ProductPhotoModel } from "@/features/product/data/models/product-photo";
import { RecipeItemModel } from "@/features/product/data/models/recipe-item";
import {
  ProductService,
  ListProductsServiceResult,
  ListProductsForSaleServiceResult,
} from "@/features/product/domain/sources/product";
import {
  CreateProductParams,
  UpdateProductParams,
  ListProductsParams,
  ListProductsForSaleParams,
  AddVariantParams,
  UpdateVariantParams,
  SaveRecipeParams,
} from "@/features/product/domain/repositories/product";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class ProductServiceImpl implements ProductService {
  constructor(private readonly http: HttpRequest) {}

  public async list(params: ListProductsParams, session: SessionEntity): Promise<ListProductsServiceResult> {
    try {
      const searchParams: Record<string, any> = {};
      if (params.page) searchParams["page"] = String(params.page);
      if (params.limit) searchParams["limit"] = String(params.limit);
      if (params.categoryIds && params.categoryIds.length > 0) searchParams["category_id"] = params.categoryIds.join(",");
      if (params.type) searchParams["type"] = params.type;
      if (params.search) searchParams["search"] = params.search;

      const result = await this.http.request({
        path: "/products",
        method: "GET",
        searchParams,
        session,
      });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return {
        data: items.map(ProductModel.fromJson),
        meta: {
          page: result.meta?.page ?? 1,
          limit: result.meta?.limit ?? 10,
          total: result.meta?.total ?? 0,
          totalPages: result.meta?.total_pages ?? 1,
        },
      };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async listForSale(
    params: ListProductsForSaleParams,
    session: SessionEntity,
  ): Promise<ListProductsForSaleServiceResult> {
    try {
      const searchParams: Record<string, any> = {};
      if (params.page) searchParams["page"] = String(params.page);
      if (params.limit) searchParams["limit"] = String(params.limit);
      if (params.categoryIds && params.categoryIds.length > 0) searchParams["category_id"] = params.categoryIds.join(",");
      if (params.search) searchParams["search"] = params.search;

      const result = await this.http.request({
        path: "/products/for-sale",
        method: "GET",
        searchParams,
        session,
      });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return {
        data: items.map(ProductForSaleModel.fromJson),
        meta: {
          page: result.meta?.page ?? 1,
          limit: result.meta?.limit ?? 10,
          total: result.meta?.total ?? 0,
          totalPages: result.meta?.total_pages ?? 1,
        },
      };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async get(id: string, session: SessionEntity): Promise<ProductModel> {
    try {
      const result = await this.http.request({
        path: `/products/${id}`,
        method: "GET",
        session,
      });

      return ProductModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async create(params: CreateProductParams, session: SessionEntity): Promise<ProductModel> {
    try {
      const body: Record<string, any> = {
        name: params.name,
        sku: params.sku,
        type: params.type,
        variants: params.variants.map((v) => {
          const variant: Record<string, any> = { name: v.name, price: v.price };
          if (v.sku) variant["sku"] = v.sku;
          if (v.recipe && v.recipe.length > 0) {
            variant["recipe"] = v.recipe.map((r) => ({ raw_material_id: r.rawMaterialId, quantity: r.quantity }));
          }
          return variant;
        }),
      };
      if (params.productionMode) body["production_mode"] = params.productionMode;
      if (params.active !== undefined) body["active"] = params.active;
      if (params.categoryId) body["category"] = { id: params.categoryId };

      const result = await this.http.request({
        path: "/products",
        method: "POST",
        body,
        session,
      });

      return ProductModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async update(id: string, params: UpdateProductParams, session: SessionEntity): Promise<ProductModel> {
    try {
      const body: Record<string, any> = {};
      if (params.name !== undefined) body["name"] = params.name;
      if (params.sku !== undefined) body["sku"] = params.sku;
      if (params.type !== undefined) body["type"] = params.type;
      if (params.productionMode !== undefined) body["production_mode"] = params.productionMode ?? null;
      if (params.active !== undefined) body["active"] = params.active;
      if (params.categoryId !== undefined) {
        body["category"] = params.categoryId === null ? null : { id: params.categoryId };
      }

      const result = await this.http.request({
        path: `/products/${id}`,
        method: "PUT",
        body,
        session,
      });

      return ProductModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async delete(id: string, session: SessionEntity): Promise<void> {
    try {
      await this.http.request({
        path: `/products/${id}`,
        method: "DELETE",
        session,
      });
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async uploadPhoto(productId: string, file: File, session: SessionEntity): Promise<ProductPhotoModel> {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const formData = new FormData();
      formData.append("photo", file);

      const response = await fetch(`${baseUrl}/products/${productId}/photos`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.accessToken}` },
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        const errorCode = ErrorCodes.find(data.code);
        if (errorCode) throw new ServerError(errorCode);
        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }

      const result = await response.json();
      return ProductPhotoModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async deletePhoto(productId: string, photoId: string, session: SessionEntity): Promise<void> {
    try {
      await this.http.request({
        path: `/products/${productId}/photos/${photoId}`,
        method: "DELETE",
        session,
      });
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async addVariant(productId: string, params: AddVariantParams, session: SessionEntity): Promise<void> {
    try {
      await this.http.request({
        path: `/products/${productId}/variants`,
        method: "POST",
        body: params,
        session,
      });
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async updateVariant(
    productId: string,
    variantId: string,
    params: UpdateVariantParams,
    session: SessionEntity,
  ): Promise<void> {
    try {
      await this.http.request({
        path: `/products/${productId}/variants/${variantId}`,
        method: "PUT",
        body: params,
        session,
      });
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async deleteVariant(productId: string, variantId: string, session: SessionEntity): Promise<void> {
    try {
      await this.http.request({
        path: `/products/${productId}/variants/${variantId}`,
        method: "DELETE",
        session,
      });
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async getRecipe(productId: string, variantId: string, session: SessionEntity): Promise<RecipeItemModel[]> {
    try {
      const result = await this.http.request({
        path: `/products/${productId}/variants/${variantId}/recipes`,
        method: "GET",
        session,
      });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return items.map(RecipeItemModel.fromJson);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async saveRecipe(
    productId: string,
    variantId: string,
    params: SaveRecipeParams,
    session: SessionEntity,
  ): Promise<void> {
    try {
      await this.http.request({
        path: `/products/${productId}/variants/${variantId}/recipes`,
        method: "PUT",
        body: {
          items: params.items.map((item) => ({
            raw_material_id: item.rawMaterialId,
            quantity: item.quantity,
          })),
        },
        session,
      });
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
