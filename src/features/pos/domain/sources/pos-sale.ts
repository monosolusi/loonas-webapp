import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PosSaleModel } from "@/features/pos/data/models/pos-sale";
import {
  CreatePosSaleParams,
  GetPosSaleParams,
  ListPosSalesParams,
} from "@/features/pos/domain/repositories/pos-sale";

export type ListPosSalesServiceResult = {
  sales: PosSaleModel[];
  meta: PaginationMeta;
};

export interface PosSaleService {
  create(params: CreatePosSaleParams, session: SessionEntity): Promise<PosSaleModel>;
  get(params: GetPosSaleParams, session: SessionEntity): Promise<PosSaleModel>;
  list(params: ListPosSalesParams, session: SessionEntity): Promise<ListPosSalesServiceResult>;
}
