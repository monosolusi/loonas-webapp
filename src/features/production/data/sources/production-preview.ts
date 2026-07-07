import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ProductionPreviewModel } from "@/features/production/data/models/production-preview";
import { ProductionPreviewService } from "@/features/production/domain/sources/production-preview";
import { PreviewProductionParams } from "@/features/production/domain/repositories/production-preview";

export class ProductionPreviewServiceImpl implements ProductionPreviewService {
  constructor(private readonly http: HttpRequest) {}

  public async preview(params: PreviewProductionParams, session: SessionEntity): Promise<ProductionPreviewModel> {
    try {
      const result = await this.http.request({
        path: `/products/${params.productId}/variants/${params.variantId}/productions/preview`,
        method: "POST",
        body: { quantity: params.quantity },
        session,
      });

      return ProductionPreviewModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
