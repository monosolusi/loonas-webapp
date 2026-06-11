import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { CoaMappingEntityTypeModel } from "@/features/accounting/data/models/coa-mapping-entity-type";
import { CoaMappingEntityTypeService } from "@/features/accounting/domain/sources/coa-mapping-entity-type";

export class CoaMappingEntityTypeServiceImpl implements CoaMappingEntityTypeService {
  constructor(private readonly http: HttpRequest) {}

  public async list(session: SessionEntity): Promise<CoaMappingEntityTypeModel[]> {
    try {
      const result = await this.http.request({
        path: "/accounting/coa-mapping-entity-types",
        method: "GET",
        session,
      });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return items.map(CoaMappingEntityTypeModel.fromJson);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
