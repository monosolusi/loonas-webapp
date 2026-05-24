import { PublicPayInDetailModel } from "@/features/payment/data/models/public-pay-in-detail";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { VirtualAccountPayInDetailModel } from "@/features/payment/data/models/va-pay-in-detail";
import { CreditCardFullRedirectPayInDetailModel } from "@/features/payment/data/models/cc-full-redirect-pay-in-detail";

export type GetDetailReturnType = VirtualAccountPayInDetailModel | CreditCardFullRedirectPayInDetailModel;

export interface PayInDetailService {
  getPublic(params: { invoiceId: string }): Promise<PublicPayInDetailModel>;

  getDetail(params: { requestId: string }, session: SessionEntity): Promise<GetDetailReturnType>;
}
