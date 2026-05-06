import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { ProductForSaleEntity } from "@/features/product/domain/entities/product-for-sale";

export type ListProductsForSaleFetcherParams = {
  clerk: ReturnType<typeof useClerk>;
  page?: number;
  limit?: number;
  categoryIds?: string[];
  search?: string;
};

type Meta = { page: number; limit: number; total: number; totalPages: number };

type InitialState = {
  status: "loading";
  products: null;
  meta: null;
  error: null;
};

type LoadedState = {
  status: "loaded";
  products: ProductForSaleEntity[];
  meta: Meta;
  error: null;
};

type ErrorState = {
  status: "error";
  products: null;
  meta: null;
  error: ServerError;
};

export type UseListProductsForSaleState = InitialState | LoadedState | ErrorState;
