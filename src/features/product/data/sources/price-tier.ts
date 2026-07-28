import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PriceTierScheduleModel } from "@/features/product/data/models/price-tier-schedule";
import { PriceTierCopyResultModel } from "@/features/product/data/models/price-tier-copy-result";
import {
  GetPriceTiersParams,
  SavePriceTiersParams,
  CopyPriceTiersParams,
  PriceTierInput,
} from "@/features/product/domain/repositories/price-tier";
import { PriceTierService } from "@/features/product/domain/sources/price-tier";
import { TierModeType } from "@/features/product/domain/enums/tier-mode";

export class PriceTierServiceImpl implements PriceTierService {
  constructor(private readonly http: HttpRequest) {}

  private buildBody(tierMode: TierModeType, tiers: PriceTierInput[]): Record<string, any> {
    // Both keys are required on every write. `tiers: []` is a valid request, not a no-op —
    // it clears the schedule while still writing `tier_mode`.
    return {
      tier_mode: tierMode,
      tiers: tiers.map((tier) => ({
        min_qty: tier.minQty,
        unit_price: tier.unitPrice,
      })),
    };
  }

  private unwrap(result: Record<string, any> | undefined): Record<string, any> {
    // All three price-tier endpoints are envelope-wrapped, unlike the single-object
    // product endpoints which return a bare body.
    const data = result?.["data"];
    if (!data || typeof data !== "object") throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return data;
  }

  public async get(params: GetPriceTiersParams, session: SessionEntity): Promise<PriceTierScheduleModel> {
    try {
      const result = await this.http.request({
        path: `/products/${params.productId}/variants/${params.variantId}/price-tiers`,
        method: "GET",
        session,
      });

      return PriceTierScheduleModel.fromJson(this.unwrap(result));
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async save(params: SavePriceTiersParams, session: SessionEntity): Promise<PriceTierScheduleModel> {
    try {
      const result = await this.http.request({
        path: `/products/${params.productId}/variants/${params.variantId}/price-tiers`,
        method: "PUT",
        body: this.buildBody(params.tierMode, params.tiers),
        session,
      });

      return PriceTierScheduleModel.fromJson(this.unwrap(result));
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async copyToVariants(params: CopyPriceTiersParams, session: SessionEntity): Promise<PriceTierCopyResultModel> {
    try {
      const result = await this.http.request({
        path: `/products/${params.productId}/price-tiers`,
        method: "PUT",
        body: this.buildBody(params.tierMode, params.tiers),
        session,
      });

      return PriceTierCopyResultModel.fromJson(this.unwrap(result));
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
