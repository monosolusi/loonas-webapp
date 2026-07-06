import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PaymentMethodLimitModel } from "@/features/payment/data/models/payment-method-limit";
import { LimitService } from "@/features/transaction-monitoring/domain/sources/limit";
import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class LimitServiceImpl implements LimitService {
  constructor(private readonly http: HttpRequest) {}

  public async getPaymentMethodLimit(params: { id: string }, session: SessionEntity): Promise<PaymentMethodLimitModel> {
    try {
      const path = `/payment-gateways/${params.id}/limit`;
      const method = "GET";
      const result = await this.http.request({ path, method, session });
      if (!result) throw new Error("Invalid response from server");

      return PaymentMethodLimitModel.fromJson(result.data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
