import { DateTime } from "luxon";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PartnerService } from "@/features/partner/data/sources/partner";
import { BankService } from "@/features/bank/data/sources/bank";
import { PaymentGatewayService } from "@/features/payment/data/sources/payment-gateway";
import { PaymentRequestModel } from "../models/payment-request";

interface PaymentRequestServiceCreateParams {
  receiverId: string;
  receiverBankAccountId: string;
  invoices: { invoiceNumber?: string, amount: number, dueDate: DateTime }[],
  paymentMethodId: string;
  paymentSchemeId?: string;
}

export abstract class PaymentRequestService {
  public abstract create(params: PaymentRequestServiceCreateParams, session: SessionEntity): Promise<PaymentRequestModel>;

  public abstract uploadInvoices(params: {
    requestId: string,
    invoiceDocuments: File[]
  }, session: SessionEntity): Promise<void>;
}

export class PaymentRequestServiceImpl implements PaymentRequestService {

  constructor(
    private readonly partnerService: PartnerService,
    private readonly bankService: BankService,
    private readonly paymentGatewayService: PaymentGatewayService
  ) {
  }

  public async uploadInvoices(params: {
    requestId: string;
    invoiceDocuments: File[];
  }, session: SessionEntity): Promise<void> {
    try {
      if (!session.selectedAccount) throw new ServerError(ErrorCodes.NO_SELECTED_ACCOUNT);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/payment-requests/${params.requestId}/invoice-documents`;
      const headers = {
        Authorization: `Bearer ${session.accessToken}`,
        "X-Account-Id": session.selectedAccount.id
      };

      const formData = new FormData();
      params.invoiceDocuments.forEach((file) => {
        formData.append("invoice_documents", file);
      });

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData
      });

      if (!response.ok) {
        const data = await response.json();
        if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });

        const ErrorCode = ErrorCodes.find(data.code);
        if (ErrorCode) throw new ServerError(ErrorCode);
        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async create(params: PaymentRequestServiceCreateParams, session: SessionEntity): Promise<PaymentRequestModel> {
    try {
      if (!session.selectedAccount) throw new ServerError(ErrorCodes.NO_SELECTED_ACCOUNT);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/payment-requests`;
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.accessToken}`,
        "X-Account-Id": session.selectedAccount.id
      };

      const body = {
        receiver_id: params.receiverId,
        receiver_bank_account_id: params.receiverBankAccountId,
        invoices: params.invoices.map(invoice => ({
          ...invoice.invoiceNumber ? { invoice_number: invoice.invoiceNumber } : {}, // If empty, then don't include that to the request body
          amount: invoice.amount,
          due_date: invoice.dueDate.toISODate()
        })),
        payment_method_id: params.paymentMethodId,
        payment_scheme_id: params.paymentSchemeId
      };

      const response = await fetch(url, { method: "POST", headers, body: JSON.stringify(body) });
      if (!response.ok) {
        const data = await response.json();
        if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });

        const ErrorCode = ErrorCodes.find(data.code);
        if (ErrorCode) throw new ServerError(ErrorCode);
        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }

      const data = await response.json();
      // Looking for the PartnerModel, BankAccountModel, PaymentGatewayModel, PaymentSchemeModel from others
      const bankAccount = await this.bankService.getBankAccount({
        partnerId: data.receiver_id,
        id: data.receiver_bank_account_id
      }, session);

      const receiver = await this.partnerService.get({ id: data.receiver_id }, session);
      const paymentMethod = await this.paymentGatewayService.get({ id: data.payment_method_id }, session);
      const paymentScheme = paymentMethod.requiresSchemeSelection ? await this.paymentGatewayService.getScheme({
        id: data.payment_scheme_id,
        gatewayId: data.payment_method_id
      }, session) : undefined;

      return PaymentRequestModel.fromJson(data, { receiver, bankAccount, paymentMethod, paymentScheme });
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

}