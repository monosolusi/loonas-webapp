import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PaymentMethodCategoryEntity } from "@/features/payment/domain/entities/payment-method-category.entity";
import { DataState } from "@/core/resources/data-state";

export interface PaymentMethodRepository {
  listDisplay(session: SessionEntity): Promise<DataState<PaymentMethodCategoryEntity[]>>;
}
