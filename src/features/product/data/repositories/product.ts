import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ProductEntity } from "@/features/product/domain/entities/product";
import { ProductPhotoEntity } from "@/features/product/domain/entities/product-photo";
import {
  ProductRepository,
  CreateProductParams,
  UpdateProductParams,
  ListProductsParams,
  ListProductsResult,
  AddVariantParams,
  UpdateVariantParams,
} from "@/features/product/domain/repositories/product";
import { ProductService } from "@/features/product/domain/sources/product";

export class ProductRepositoryImpl implements ProductRepository {
  constructor(private readonly service: ProductService) {}

  public async list(params: ListProductsParams, session: SessionEntity): Promise<DataState<ListProductsResult>> {
    try {
      const result = await this.service.list(params, session);
      return new DataSuccess({
        products: result.data.map((p) => p.toEntity()),
        meta: result.meta,
      });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async get(id: string, session: SessionEntity): Promise<DataState<ProductEntity>> {
    try {
      const product = await this.service.get(id, session);
      return new DataSuccess(product.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async create(params: CreateProductParams, session: SessionEntity): Promise<DataState<ProductEntity>> {
    try {
      const product = await this.service.create(params, session);
      return new DataSuccess(product.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async update(id: string, params: UpdateProductParams, session: SessionEntity): Promise<DataState<ProductEntity>> {
    try {
      const product = await this.service.update(id, params, session);
      return new DataSuccess(product.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async delete(id: string, session: SessionEntity): Promise<DataState<void>> {
    try {
      await this.service.delete(id, session);
      return new DataSuccess(undefined);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async uploadPhoto(productId: string, file: File, session: SessionEntity): Promise<DataState<ProductPhotoEntity>> {
    try {
      const photo = await this.service.uploadPhoto(productId, file, session);
      return new DataSuccess(photo.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async deletePhoto(productId: string, photoId: string, session: SessionEntity): Promise<DataState<void>> {
    try {
      await this.service.deletePhoto(productId, photoId, session);
      return new DataSuccess(undefined);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async addVariant(productId: string, params: AddVariantParams, session: SessionEntity): Promise<DataState<void>> {
    try {
      await this.service.addVariant(productId, params, session);
      return new DataSuccess(undefined);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async updateVariant(
    productId: string,
    variantId: string,
    params: UpdateVariantParams,
    session: SessionEntity,
  ): Promise<DataState<void>> {
    try {
      await this.service.updateVariant(productId, variantId, params, session);
      return new DataSuccess(undefined);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async deleteVariant(productId: string, variantId: string, session: SessionEntity): Promise<DataState<void>> {
    try {
      await this.service.deleteVariant(productId, variantId, session);
      return new DataSuccess(undefined);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
