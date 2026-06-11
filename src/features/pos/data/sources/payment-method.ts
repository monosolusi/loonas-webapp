import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PaymentMethodModel } from "@/features/pos/data/models/payment-method";
import {
  ListPaymentMethodsServiceResult,
  PaymentMethodService,
} from "@/features/pos/domain/sources/payment-method";
import { ListPaymentMethodsParams } from "@/features/pos/domain/repositories/payment-method";

export class PaymentMethodServiceImpl implements PaymentMethodService {
  constructor(private readonly http: HttpRequest) {}

  public async list(
    params: ListPaymentMethodsParams,
    session: SessionEntity,
  ): Promise<ListPaymentMethodsServiceResult> {
    try {
      const searchParams: Record<string, any> = {};
      if (params.isEnabled !== undefined) searchParams["is_enabled"] = String(params.isEnabled);

      const result = await this.http.request({
        path: "/pos/payment-methods",
        method: "GET",
        searchParams,
        session,
      });

      const items = result?.data;
      if (!Array.isArray(items)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      return { data: items.map(PaymentMethodModel.fromJson) };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
