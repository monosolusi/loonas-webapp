import { DataState } from "@/core/resources/data-state";
import { PaginatedData } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PurchaseEntity } from "@/features/purchasing/domain/entities/purchase";

export type ListPurchasesParams = {
  page?: number;
  limit?: number;
};

export type CreatePurchaseParams = {
  date: string;
  note?: string;
  items: CreatePurchaseItemParams[];
};

export type CreatePurchaseItemParams = {
  rawMaterialId?: string;
  variantId?: string;
  quantity: number;
  unitPrice: number;
};

export interface PurchaseRepository {
  list(params: ListPurchasesParams, session: SessionEntity): Promise<DataState<PaginatedData<PurchaseEntity>>>;
  get(id: string, session: SessionEntity): Promise<DataState<PurchaseEntity>>;
  create(params: CreatePurchaseParams, session: SessionEntity): Promise<DataState<PurchaseEntity>>;
  delete(id: string, session: SessionEntity): Promise<DataState<void>>;
}
