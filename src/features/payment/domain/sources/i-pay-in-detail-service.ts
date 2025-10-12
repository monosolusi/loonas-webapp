import { PaymentMethodPayInDetailModel } from "@/features/payment/domain/types/payment-method-pay-in-detail-model";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

type Filter = Partial<{ id: string; invoice: { id: string } }>;

export interface IPayInDetailService {
  get(filter: Filter, session: SessionEntity): Promise<PaymentMethodPayInDetailModel>;
}
