import { IPayInDetailService } from "@/features/payment/domain/sources/i-pay-in-detail-service";
import { PaymentMethodPayInDetailModel } from "../../domain/types/payment-method-pay-in-detail-model";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export class OutgoingInvoicePayInDetailService implements IPayInDetailService {
  constructor() {}

  public async get(_filter: Partial<{ id: string }>, _session: SessionEntity): Promise<PaymentMethodPayInDetailModel> {
    throw new ServerError(ErrorCodes.NOT_IMPLEMENTED);
  }
}
