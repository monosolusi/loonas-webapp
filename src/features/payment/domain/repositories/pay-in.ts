import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { VirtualAccountPayInDetailEntity } from "@/features/payment/domain/entities/va-pay-in-detail";
import { DataState } from "@/core/resources/data-state";

type PayInReturnType = VirtualAccountPayInDetailEntity;

export abstract class PayInRepository {
  public abstract getDetail(params: {
    requestId: string
  }, session: SessionEntity): Promise<DataState<PayInReturnType>>;
}