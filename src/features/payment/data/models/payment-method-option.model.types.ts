import { PaymentGatewayModel } from "@/features/payment/data/models/payment-gateway";
import { PaymentSchemeModel } from "@/features/payment/data/models/payment-scheme";

export type PaymentMethodOptionModelConstructor = {
  type: string;
  title: string;
  baseFee: number;
  percentageFee: number;
  gateway: PaymentGatewayModel;
  scheme?: PaymentSchemeModel;
};
