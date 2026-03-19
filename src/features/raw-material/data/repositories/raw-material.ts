import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { RawMaterialEntity } from "@/features/raw-material/domain/entities/raw-material";
import {
  RawMaterialRepository,
  CreateRawMaterialParams,
  UpdateRawMaterialParams,
  ListRawMaterialsParams,
  ListRawMaterialsResult,
} from "@/features/raw-material/domain/repositories/raw-material";
import { RawMaterialService } from "@/features/raw-material/domain/sources/raw-material";

export class RawMaterialRepositoryImpl implements RawMaterialRepository {
  constructor(private readonly service: RawMaterialService) {}

  public async list(params: ListRawMaterialsParams, session: SessionEntity): Promise<DataState<ListRawMaterialsResult>> {
    try {
      const result = await this.service.list(params, session);
      return new DataSuccess({
        rawMaterials: result.data.map((m) => m.toEntity()),
        meta: result.meta,
      });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async create(params: CreateRawMaterialParams, session: SessionEntity): Promise<DataState<RawMaterialEntity>> {
    try {
      const result = await this.service.create(params, session);
      return new DataSuccess(result.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async update(id: string, params: UpdateRawMaterialParams, session: SessionEntity): Promise<DataState<RawMaterialEntity>> {
    try {
      const result = await this.service.update(id, params, session);
      return new DataSuccess(result.toEntity());
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
}
