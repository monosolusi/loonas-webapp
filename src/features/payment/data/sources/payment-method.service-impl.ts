import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PaymentMethodService } from "@/features/payment/domain/sources/payment-method.service";
import { PaymentMethodCategoryModel } from "@/features/payment/data/models/payment-method-category.model";
import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class PaymentMethodServiceImpl implements PaymentMethodService {
  constructor(private readonly http: HttpRequest) {}

  public async listDisplay(session: SessionEntity): Promise<PaymentMethodCategoryModel[]> {
    try {
      const path = `/payment-methods`;
      const method = "GET";
      const result = await this.http.request({ path, method, session });
      if (!result) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return result.data.map((method: Record<string, any>) => PaymentMethodCategoryModel.fromJson(method));
    } catch (err) {
      if (!(err instanceof ServerError)) throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
      else throw err;
    }
  }
}
