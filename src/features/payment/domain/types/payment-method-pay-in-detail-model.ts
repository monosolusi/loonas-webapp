import { CreditCardFullRedirectPayInDetailModel } from "@/features/payment/data/models/cc-full-redirect-pay-in-detail";
import { VirtualAccountPayInDetailModel } from "@/features/payment/data/models/va-pay-in-detail";
import { QrisPayInDetailModel } from "@/features/invoice/data/models/pay-in-detail/qris-pay-in-detail";
import { CashPayInDetailModel } from "@/features/invoice/data/models/pay-in-detail/cash-pay-in-detail";

export type PaymentMethodPayInDetailModel =
  | CashPayInDetailModel
  | CreditCardFullRedirectPayInDetailModel
  | VirtualAccountPayInDetailModel
  | QrisPayInDetailModel;
