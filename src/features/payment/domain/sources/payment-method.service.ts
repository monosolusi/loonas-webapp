import { PaymentMethodCategoryModel } from "@/features/payment/data/models/payment-method-category.model";
import { SessionEntity } from "@/features/authentication/domain/entities/session";

export interface PaymentMethodService {
  listDisplay(session: SessionEntity): Promise<PaymentMethodCategoryModel[]>;
}
