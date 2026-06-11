import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { RawMaterialModel } from "@/features/raw-material/data/models/raw-material";
import {
  CreateRawMaterialParams,
  UpdateRawMaterialParams,
  ListRawMaterialsParams,
} from "@/features/raw-material/domain/repositories/raw-material";

export type ListRawMaterialsServiceResult = {
  data: RawMaterialModel[];
  meta: PaginationMeta;
};

export interface RawMaterialService {
  list(params: ListRawMaterialsParams, session: SessionEntity): Promise<ListRawMaterialsServiceResult>;
  get(id: string, session: SessionEntity): Promise<RawMaterialModel>;
  create(params: CreateRawMaterialParams, session: SessionEntity): Promise<RawMaterialModel>;
  update(id: string, params: UpdateRawMaterialParams, session: SessionEntity): Promise<RawMaterialModel>;
  delete(id: string, session: SessionEntity): Promise<void>;
}
