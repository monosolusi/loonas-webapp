import { PaymentMethodOptionModel } from "@/features/payment/data/models/payment-method-option.model";

export type PaymentMethodCategoryModelConstructor = {
  type: string;
  title: string;
  description: string;
  selections: PaymentMethodOptionModel[];
};
