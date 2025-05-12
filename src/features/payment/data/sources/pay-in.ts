import { VirtualAccountPayInDetailModel } from "@/features/payment/data/models/va-pay-in-detail";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

type GetDetailReturnType = VirtualAccountPayInDetailModel;

export abstract class PayInService {
  public abstract getDetail(params: {
    requestId: string
  }, session: SessionEntity): Promise<GetDetailReturnType>
}