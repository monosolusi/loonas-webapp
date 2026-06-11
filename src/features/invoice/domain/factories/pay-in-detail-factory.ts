import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { HttpRequest } from "@/core/helpers/http-request";
import { IPayInDetailService } from "@/features/payment/domain/sources/i-pay-in-detail-service";
import { IncomingInvoicePayInDetailService } from "@/features/payment/data/sources/incoming-invoice-pay-in-detail-service";
import { PayInType } from "@/features/invoice/domain/enums/pay-in-type";
import { VirtualAccountPayInDetailModel } from "@/features/payment/data/models/va-pay-in-detail";
import { CreditCardFullRedirectPayInDetailModel } from "@/features/payment/data/models/cc-full-redirect-pay-in-detail";
import { QrisPayInDetailModel } from "@/features/invoice/data/models/pay-in-detail/qris-pay-in-detail";
import { CashPayInDetailModel } from "@/features/invoice/data/models/pay-in-detail/cash-pay-in-detail";
import { OutgoingInvoicePayInDetailService } from "@/features/payment/data/sources/outgoing-invoice-pay-in-detail-service";

type INCOMING_INVOICE = { type: InvoiceType.INCOMING };
type OUTGOING_INVOICE = { type: InvoiceType.OUTGOING };
type INVOICE_TYPE = { type: InvoiceType };

type CASH = { type: PayInType.CASH };
type QRIS = { type: PayInType.QRIS };
type VIRTUAL_ACCOUNT = { type: PayInType.VIRTUAL_ACCOUNT };
type CREDIT_CARD_FULL_REDIRECT = { type: PayInType.CREDIT_CARD_FULL_REDIRECT };
type CREDIT_CARD_FULL_REDIRECT_INSTALLMENT_3_MONTHS = {
  type: PayInType.CREDIT_CARD_FULL_REDIRECT_INSTALLMENT_3_MONTHS;
};
type CREDIT_CARD_FULL_REDIRECT_INSTALLMENT_6_MONTHS = {
  type: PayInType.CREDIT_CARD_FULL_REDIRECT_INSTALLMENT_6_MONTHS;
};
type CREDIT_CARD_FULL_REDIRECT_INSTALLMENT_12_MONTHS = {
  type: PayInType.CREDIT_CARD_FULL_REDIRECT_INSTALLMENT_12_MONTHS;
};
type PAY_IN_TYPE = { type: PayInType };

export class PayInDetailFactory {
  public getService(params: INCOMING_INVOICE): IncomingInvoicePayInDetailService;
  public getService(params: OUTGOING_INVOICE): OutgoingInvoicePayInDetailService;
  public getService(params: INVOICE_TYPE): IPayInDetailService;
  public getService(params: INVOICE_TYPE) {
    const http = new HttpRequest();
    switch (params.type) {
      case InvoiceType.INCOMING:
        return new IncomingInvoicePayInDetailService(http, new PayInDetailFactory());
      case InvoiceType.OUTGOING:
        return new OutgoingInvoicePayInDetailService();
      default:
        throw new ServerError(ErrorCodes.NOT_IMPLEMENTED);
    }
  }

  public getModel(params: CASH): typeof CashPayInDetailModel;
  public getModel(params: QRIS): typeof QrisPayInDetailModel;
  public getModel(params: VIRTUAL_ACCOUNT): typeof VirtualAccountPayInDetailModel;
  public getModel(params: CREDIT_CARD_FULL_REDIRECT): typeof CreditCardFullRedirectPayInDetailModel;
  public getModel(
    params: CREDIT_CARD_FULL_REDIRECT_INSTALLMENT_3_MONTHS,
  ): typeof CreditCardFullRedirectPayInDetailModel;
  public getModel(
    params: CREDIT_CARD_FULL_REDIRECT_INSTALLMENT_6_MONTHS,
  ): typeof CreditCardFullRedirectPayInDetailModel;
  public getModel(
    params: CREDIT_CARD_FULL_REDIRECT_INSTALLMENT_12_MONTHS,
  ): typeof CreditCardFullRedirectPayInDetailModel;
  public getModel(
    params: PAY_IN_TYPE,
  ):
    | typeof CashPayInDetailModel
    | typeof QrisPayInDetailModel
    | typeof VirtualAccountPayInDetailModel
    | typeof CreditCardFullRedirectPayInDetailModel;
  public getModel(params: PAY_IN_TYPE) {
    switch (params.type) {
      case PayInType.CASH:
        return CashPayInDetailModel;
      case PayInType.CREDIT_CARD_FULL_REDIRECT:
      case PayInType.CREDIT_CARD_FULL_REDIRECT_INSTALLMENT_3_MONTHS:
      case PayInType.CREDIT_CARD_FULL_REDIRECT_INSTALLMENT_6_MONTHS:
      case PayInType.CREDIT_CARD_FULL_REDIRECT_INSTALLMENT_12_MONTHS:
        return CreditCardFullRedirectPayInDetailModel;
      case PayInType.QRIS:
        return QrisPayInDetailModel;
      case PayInType.VIRTUAL_ACCOUNT:
        return VirtualAccountPayInDetailModel;
      default:
        throw new ServerError(ErrorCodes.NOT_IMPLEMENTED);
    }
  }
}
