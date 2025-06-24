import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PaymentMethodLimitEntity } from "@/features/payment/domain/entities/payment-method-limit";

export interface LimitRepository {
  getPaymentMethodLimit(params: { id: string }, session: SessionEntity): Promise<DataState<PaymentMethodLimitEntity>>;
}
