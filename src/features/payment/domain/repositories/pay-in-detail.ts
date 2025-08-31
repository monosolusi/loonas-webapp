import { DataState } from "@/core/resources/data-state";
import { PublicPayInDetailEntity } from "@/features/payment/domain/entities/public-pay-in-detail";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { VirtualAccountPayInDetailEntity } from "@/features/payment/domain/entities/va-pay-in-detail";
import { CreditCardFullRedirectPayInDetailEntity } from "@/features/payment/domain/entities/cc-full-redirect-pay-in-detail";

export type PayInReturnType = VirtualAccountPayInDetailEntity | CreditCardFullRedirectPayInDetailEntity;

export interface PayInDetailRepository {
  getPublic(params: { invoiceId: string }): Promise<DataState<PublicPayInDetailEntity>>;

  getDetail(params: { requestId: string }, session: SessionEntity): Promise<DataState<PayInReturnType>>;
}
