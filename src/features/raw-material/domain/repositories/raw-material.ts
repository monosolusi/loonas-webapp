import { DataState } from "@/core/resources/data-state";
import { PaginationMeta } from "@/core/resources/paginated";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { RawMaterialEntity } from "@/features/raw-material/domain/entities/raw-material";

export type CreateRawMaterialParams = {
  name: string;
  unit: string;
};

export type UpdateRawMaterialParams = {
  name?: string;
  unit?: string;
};

export type ListRawMaterialsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export type ListRawMaterialsResult = {
  rawMaterials: RawMaterialEntity[];
  meta: PaginationMeta;
};

export interface RawMaterialRepository {
  list(params: ListRawMaterialsParams, session: SessionEntity): Promise<DataState<ListRawMaterialsResult>>;
  create(params: CreateRawMaterialParams, session: SessionEntity): Promise<DataState<RawMaterialEntity>>;
  update(id: string, params: UpdateRawMaterialParams, session: SessionEntity): Promise<DataState<RawMaterialEntity>>;
  delete(id: string, session: SessionEntity): Promise<DataState<void>>;
}
