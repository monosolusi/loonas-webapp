import { DataState } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PaymentMethodEntity } from "@/features/pos/domain/entities/payment-method";

export type ListPaymentMethodsParams = {
  isEnabled?: boolean;
};

export type ListPaymentMethodsResult = {
  paymentMethods: PaymentMethodEntity[];
};

export interface PaymentMethodRepository {
  list(params: ListPaymentMethodsParams, session: SessionEntity): Promise<DataState<ListPaymentMethodsResult>>;
}
