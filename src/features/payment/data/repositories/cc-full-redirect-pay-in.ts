import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { CreditCardFullRedirectPayInDetailModel } from "@/features/payment/data/models/cc-full-redirect-pay-in-detail";
import { CreditCardFullRedirectPayInService } from "@/features/payment/data/sources/cc-full-redirect-pay-in";
import { CreditCardFullRedirectPayInDetailEntity } from "@/features/payment/domain/entities/cc-full-redirect-pay-in-detail";
import { PayInDetailService } from "@/features/payment/domain/sources/pay-in-detail";
import { PayInDetailRepository } from "@/features/payment/domain/repositories/pay-in-detail";
import { PublicPayInDetailEntity } from "../../domain/entities/public-pay-in-detail";

export class CreditCardFullRedirectPayInRepository implements PayInDetailRepository {
  constructor(private readonly payInService: PayInDetailService) {}

  public async getPublic(params: { invoiceId: string }): Promise<DataState<PublicPayInDetailEntity>> {
    throw new Error("Method not implemented.");
  }

  public async getDetail(
    params: {
      requestId: string;
    },
    session: SessionEntity,
  ): Promise<DataState<CreditCardFullRedirectPayInDetailEntity>> {
    try {
      if (!(this.payInService instanceof CreditCardFullRedirectPayInService))
        throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const ccDetail = await this.payInService.getDetail({ requestId: params.requestId }, session);
      if (ccDetail instanceof CreditCardFullRedirectPayInDetailModel) return new DataSuccess(ccDetail.toEntity());
      else throw new ServerError(ErrorCodes.INVALID_PAY_IN_TYPE);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
