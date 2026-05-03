import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PaymentMethodModel } from "@/features/pos/data/models/payment-method";
import { ListPaymentMethodsParams } from "@/features/pos/domain/repositories/payment-method";

export type ListPaymentMethodsServiceResult = {
  data: PaymentMethodModel[];
};

export interface PaymentMethodService {
  list(params: ListPaymentMethodsParams, session: SessionEntity): Promise<ListPaymentMethodsServiceResult>;
}
