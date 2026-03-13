import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { VirtualAccountPayInDetailModel } from "@/features/payment/data/models/va-pay-in-detail";
import { VirtualAccountPayInDetailEntity } from "@/features/payment/domain/entities/va-pay-in-detail";
import { VirtualAccountPayInService } from "@/features/payment/data/sources/va-pay-in";
import { PayInDetailRepository } from "@/features/payment/domain/repositories/pay-in-detail";
import { PayInDetailService } from "@/features/payment/domain/sources/pay-in-detail";
import { PublicPayInDetailEntity } from "../../domain/entities/public-pay-in-detail";

export class VirtualAccountPayInRepository implements PayInDetailRepository {
  constructor(private readonly payInService: PayInDetailService) {}

  public async getPublic(_params: { invoiceId: string }): Promise<DataState<PublicPayInDetailEntity>> {
    throw new ServerError(ErrorCodes.NOT_IMPLEMENTED);
  }

  public async getDetail(
    params: { requestId: string },
    session: SessionEntity,
  ): Promise<DataState<VirtualAccountPayInDetailEntity>> {
    try {
      if (!(this.payInService instanceof VirtualAccountPayInService)) {
        throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      }

      const vaDetail = await this.payInService.getDetail({ requestId: params.requestId }, session);
      if (vaDetail instanceof VirtualAccountPayInDetailModel) return new DataSuccess(vaDetail.toEntity());
      else throw new ServerError(ErrorCodes.INVALID_PAY_IN_TYPE);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
