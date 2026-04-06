import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PurchaseModel } from "@/features/purchasing/data/models/purchase";
import { CreatePurchaseParams, ListPurchasesParams } from "@/features/purchasing/domain/repositories/purchase";

export type ListPurchasesServiceResult = {
  data: PurchaseModel[];
  meta: PaginationMeta;
};

export interface PurchaseService {
  list(params: ListPurchasesParams, session: SessionEntity): Promise<ListPurchasesServiceResult>;
  get(id: string, session: SessionEntity): Promise<PurchaseModel>;
  create(params: CreatePurchaseParams, session: SessionEntity): Promise<PurchaseModel>;
  delete(id: string, session: SessionEntity): Promise<void>;
}
