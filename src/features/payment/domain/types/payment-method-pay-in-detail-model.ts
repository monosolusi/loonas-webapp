import { CreditCardFullRedirectPayInDetailModel } from "@/features/payment/data/models/cc-full-redirect-pay-in-detail";
import { VirtualAccountPayInDetailModel } from "@/features/payment/data/models/va-pay-in-detail";
import { QrisPayInDetailModel } from "@/features/payment/data/models/qris-pay-in-detail-model";

export type PaymentMethodPayInDetailModel =
  | CreditCardFullRedirectPayInDetailModel
  | VirtualAccountPayInDetailModel
  | QrisPayInDetailModel;
