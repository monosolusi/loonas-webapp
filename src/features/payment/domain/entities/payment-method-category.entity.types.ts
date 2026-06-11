import { PaymentMethodOptionEntity } from "@/features/payment/domain/entities/payment-method-option.entity";

export type PaymentMethodCategoryEntityConstructor = {
  type: string;
  title: string;
  description: string;
  selections: PaymentMethodOptionEntity[];
};
