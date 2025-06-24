import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PaymentMethodLimitModel } from "@/features/payment/data/models/payment-method-limit";

export interface LimitService {
  getPaymentMethodLimit(params: { id: string }, session: SessionEntity): Promise<PaymentMethodLimitModel>;
}
