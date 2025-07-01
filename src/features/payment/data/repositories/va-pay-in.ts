import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PayInRepository } from "@/features/payment/domain/repositories/pay-in";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { VirtualAccountPayInDetailModel } from "@/features/payment/data/models/va-pay-in-detail";
import { VirtualAccountPayInDetailEntity } from "@/features/payment/domain/entities/va-pay-in-detail";
import { PayInService } from "@/features/payment/data/sources/pay-in";
import { VirtualAccountPayInService } from "@/features/payment/data/sources/va-pay-in";

export class VirtualAccountPayInRepository implements PayInRepository {
  constructor(private readonly payInService: PayInService) {}

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
