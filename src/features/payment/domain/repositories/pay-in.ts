import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { VirtualAccountPayInDetailEntity } from "@/features/payment/domain/entities/va-pay-in-detail";
import { DataState } from "@/core/resources/data-state";
import {
  CreditCardFullRedirectPayInDetailEntity
} from "@/features/payment/domain/entities/cc-full-redirect-pay-in-detail";

type PayInReturnType = VirtualAccountPayInDetailEntity | CreditCardFullRedirectPayInDetailEntity;

export abstract class PayInRepository {
  public abstract getDetail(params: {
    requestId: string
  }, session: SessionEntity): Promise<DataState<PayInReturnType>>;
}
