import { IPayInDetailService } from "@/features/payment/domain/sources/i-pay-in-detail-service";
import { PaymentMethodPayInDetailModel } from "../../domain/types/payment-method-pay-in-detail-model";
import { HttpRequest } from "@/core/helpers/http-request";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PayInDetailFactory } from "@/features/invoice/domain/factories/pay-in-detail-factory";
import { PayInType } from "@/features/payment/domain/enums/pay-in-type";

export class IncomingInvoicePayInDetailService implements IPayInDetailService {
  constructor(
    private readonly http: HttpRequest,
    private readonly payInDetailFactory: PayInDetailFactory,
  ) {}

  public async get(
    filter: Partial<{ id: string; invoice: { id: string } }>,
    session: SessionEntity,
  ): Promise<PaymentMethodPayInDetailModel> {
    try {
      if (!filter.invoice) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      if (!filter.invoice.id) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const path = `/payment-requests/${filter.invoice.id}/pay-in-details`;
      const method = "GET";
      const result = await this.http.request({ path, method, session });
      if (!result) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      if (!Object.values(PayInType).includes(result.type)) throw new ServerError(ErrorCodes.INVALID_PAY_IN_TYPE);

      const Model = this.payInDetailFactory.getModel({ type: result.type as PayInType });

      // @ts-ignore
      return Model.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
