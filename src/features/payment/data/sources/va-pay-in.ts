import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PayInDetailServiceImpl } from "@/features/payment/data/sources/pay-in-detail";
import { VirtualAccountPayInDetailModel } from "../models/va-pay-in-detail";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";

export class VirtualAccountPayInService extends PayInDetailServiceImpl {
  public override async getDetail(
    params: {
      requestId: string;
    },
    session: SessionEntity,
  ): Promise<VirtualAccountPayInDetailModel> {
    try {
      const data = await this.getDetailImpl(params, session);
      return VirtualAccountPayInDetailModel.fromJson(data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
