import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { PaymentSchemeEntity } from "@/features/payment/domain/entities/payment-scheme";

export type PaymentMethodOptionEntityConstructor = {
  type: string;
  title: string;
  baseFee: number;
  percentageFee: number;
  gateway: PaymentGatewayEntity;
  scheme?: PaymentSchemeEntity;
};
