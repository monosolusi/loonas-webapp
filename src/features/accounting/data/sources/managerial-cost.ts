import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ManagerialCostProjectionModel } from "@/features/accounting/data/models/managerial-cost-projection";
import { ManagerialCostAllocationResultModel } from "@/features/accounting/data/models/managerial-cost-allocation-result";
import {
  ManagerialCostService,
  GetManagerialCostServiceParams,
  AllocateManagerialCostServiceParams,
} from "@/features/accounting/domain/sources/managerial-cost";

export class ManagerialCostServiceImpl implements ManagerialCostService {
  constructor(private readonly http: HttpRequest) {}

  public async getProjection(
    params: GetManagerialCostServiceParams,
    session: SessionEntity,
  ): Promise<ManagerialCostProjectionModel[]> {
    try {
      const searchParams: Record<string, string> = {};
      if (params.variantId) searchParams["variant_id"] = params.variantId;

      const result = await this.http.request({
        path: `/accounting/periods/${params.periodId}/managerial-cost`,
        method: "GET",
        searchParams: Object.keys(searchParams).length > 0 ? searchParams : undefined,
        session,
      });

      if (!Array.isArray(result.data)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return result.data.map(ManagerialCostProjectionModel.fromJson);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async allocate(
    params: AllocateManagerialCostServiceParams,
    session: SessionEntity,
  ): Promise<ManagerialCostAllocationResultModel> {
    try {
      // No Idempotency-Key — confirmed by BE author (this op is idempotent by design)
      const result = await this.http.request({
        path: `/accounting/periods/${params.periodId}/managerial-cost-allocation`,
        method: "POST",
        body: {},
        session,
      });
      return ManagerialCostAllocationResultModel.fromJson(result.data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
