import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { PayInDetailRepository, PayInReturnType } from "@/features/payment/domain/repositories/pay-in-detail";
import { PublicPayInDetailEntity } from "../../domain/entities/public-pay-in-detail";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PayInDetailService } from "../../domain/sources/pay-in-detail";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export class PayInDetailRepositoryImpl implements PayInDetailRepository {
  constructor(private readonly payInDetailService: PayInDetailService) {}

  public async getDetail(_params: { requestId: string }, _session: SessionEntity): Promise<DataState<PayInReturnType>> {
    throw new ServerError(ErrorCodes.NOT_IMPLEMENTED);
  }

  public async getPublic(params: { invoiceId: string }): Promise<DataState<PublicPayInDetailEntity>> {
    try {
      const payInDetail = await this.payInDetailService.getPublic({ invoiceId: params.invoiceId });
      return new DataSuccess(payInDetail.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
