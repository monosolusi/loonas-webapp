import { DataState } from "@/core/resources/data-state";
import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PosSaleEntity } from "@/features/pos/domain/entities/pos-sale";

export type CreatePosSaleItemParams = {
  variantId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
};

export type CreatePosSaleParams = {
  date: string;
  paymentGatewayId: string;
  discount: number;
  note?: string;
  items: CreatePosSaleItemParams[];
  idempotencyKey: string;
};

export type GetPosSaleParams = {
  id: string;
};

export type ListPosSalesParams = {
  page?: number;
  limit?: number;
};

export type ListPosSalesResult = {
  sales: PosSaleEntity[];
  meta: PaginationMeta;
};

export interface PosSaleRepository {
  create(params: CreatePosSaleParams, session: SessionEntity): Promise<DataState<PosSaleEntity>>;
  get(params: GetPosSaleParams, session: SessionEntity): Promise<DataState<PosSaleEntity>>;
  list(params: ListPosSalesParams, session: SessionEntity): Promise<DataState<ListPosSalesResult>>;
}
