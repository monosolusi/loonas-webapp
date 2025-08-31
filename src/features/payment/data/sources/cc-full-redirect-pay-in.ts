import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PayInDetailServiceImpl } from "@/features/payment/data/sources/pay-in-detail";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { CreditCardFullRedirectPayInDetailModel } from "@/features/payment/data/models/cc-full-redirect-pay-in-detail";

export class CreditCardFullRedirectPayInService extends PayInDetailServiceImpl {
  public async getDetail(
    params: {
      requestId: string;
    },
    session: SessionEntity,
  ): Promise<CreditCardFullRedirectPayInDetailModel> {
    try {
      const data = await this.getDetailImpl(params, session);
      return CreditCardFullRedirectPayInDetailModel.fromJson(data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
