import { DateTime } from "luxon";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { PaymentGatewayService } from "@/features/payment/data/sources/payment-gateway";
import { PaymentRequestModel } from "../models/payment-request";
import { PartnerModel } from "@/features/partner/data/models/partner";
import { BankAccountModel } from "@/features/bank/data/models/bank-account";
import { PaymentGatewayModel } from "@/features/payment/data/models/payment-gateway";
import { PaymentSchemeModel } from "@/features/payment/data/models/payment-scheme";
import { BankService } from "@/features/bank/domain/sources/bank";
import { PartnerService } from "@/features/partner/domain/sources/partner";

interface InvoiceDocument {
  invoiceNumber?: string;
  amount: number;
  dueDate: DateTime;
  invoiceDate: DateTime;
  note?: string;
}

interface PaymentRequestServiceCreateParams {
  receiverId: string;
  receiverBankAccountId: string;
  invoices: InvoiceDocument[];
  paymentMethodId: string;
  paymentSchemeId?: string;
}

interface PaymentRequestServiceGetParams {
  id: string;
  includes?: string;
}

export abstract class PaymentRequestService {
  public abstract create(
    params: PaymentRequestServiceCreateParams,
    session: SessionEntity,
  ): Promise<PaymentRequestModel>;

  public abstract uploadInvoices(
    params: {
      requestId: string;
      invoiceDocuments: File[];
    },
    session: SessionEntity,
  ): Promise<void>;

  public abstract get(params: PaymentRequestServiceGetParams, session: SessionEntity): Promise<PaymentRequestModel>;
}

export class PaymentRequestServiceImpl implements PaymentRequestService {
  constructor(
    private readonly partnerService: PartnerService,
    private readonly bankService: BankService,
    private readonly paymentGatewayService: PaymentGatewayService,
  ) {}

  public async get(params: PaymentRequestServiceGetParams, session: SessionEntity): Promise<PaymentRequestModel> {
    try {
      if (!session.selectedAccount) throw new ServerError(ErrorCodes.NO_SELECTED_ACCOUNT);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/payment-requests/${params.id}${params.includes ? `?include=${params.includes}` : ""}`;
      const headers = {
        Authorization: `Bearer ${session.accessToken}`,
        "X-Account-Id": session.selectedAccount.id,
      };

      const response = await fetch(url, { method: "GET", headers });
      if (!response.ok) {
        const data = await response.json();
        if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });

        const ErrorCode = ErrorCodes.find(data.code);
        if (ErrorCode) throw new ServerError(ErrorCode);
        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }

      const data = await response.json();
      const receiver = await this.getPartnerOrFetch({ id: data.receiver_id, data: data.receiver }, session);
      const bankAccount = await this.getBankAccountOrFetch(
        {
          id: data.receiver_bank_account_id,
          partnerId: data.receiver_id,
          data: data.receiver_bank_account,
        },
        session,
      );

      const paymentMethod = await this.getPaymentMethodOrFetch(
        {
          id: data.payment_method_id,
          data: data.payment_method,
        },
        session,
      );

      const paymentScheme = await this.getPaymentSchemeOrFetch(
        {
          id: data.payment_scheme_id,
          gatewayId: data.payment_method_id,
          data: data.payment_scheme,
        },
        session,
      );

      return PaymentRequestModel.fromJson(data, { receiver, bankAccount, paymentMethod, paymentScheme });
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async uploadInvoices(
    params: {
      requestId: string;
      invoiceDocuments: File[];
    },
    session: SessionEntity,
  ): Promise<void> {
    try {
      if (!session.selectedAccount) throw new ServerError(ErrorCodes.NO_SELECTED_ACCOUNT);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = `${baseUrl}/payment-requests/${params.requestId}/invoice-documents`;
      const headers = {
        Authorization: `Bearer ${session.accessToken}`,
        "X-Account-Id": session.selectedAccount.id,
      };

      const formData = new FormData();
      params.invoiceDocuments.forEach((file) => {
        formData.append("invoice_documents", file);
      });

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: formData,
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
        "X-Account-Id": session.selectedAccount.id,
      };

      const body = {
        receiver_id: params.receiverId,
        receiver_bank_account_id: params.receiverBankAccountId,
        invoices: params.invoices.map((invoice) => ({
          ...(invoice.invoiceNumber ? { invoice_number: invoice.invoiceNumber } : {}), // If empty, then don't include that to the request body
          amount: invoice.amount,
          due_date: invoice.dueDate.toISODate(),
          invoice_date: invoice.invoiceDate.toISODate(),
          ...(invoice.note ? { notes: invoice.note } : {}),
        })),
        payment_method_id: params.paymentMethodId,
        payment_scheme_id: params.paymentSchemeId,
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
      const bankAccount = await this.bankService.getBankAccount(
        {
          partnerId: data.receiver_id,
          id: data.receiver_bank_account_id,
        },
        session,
      );

      const receiver = await this.partnerService.get({ id: data.receiver_id }, session);
      const paymentMethod = await this.paymentGatewayService.get({ id: data.payment_method_id }, session);
      const paymentScheme = paymentMethod.requiresSchemeSelection
        ? await this.paymentGatewayService.getScheme(
            {
              id: data.payment_scheme_id,
              gatewayId: data.payment_method_id,
            },
            session,
          )
        : undefined;

      return PaymentRequestModel.fromJson(data, { receiver, bankAccount, paymentMethod, paymentScheme });
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  private async getPartnerOrFetch(
    params: {
      id: string;
      data: Record<string, any>;
    },
    session: SessionEntity,
  ): Promise<PartnerModel> {
    if (params.data) return PartnerModel.fromJson(params.data);
    return this.partnerService.get({ id: params.id }, session);
  }

  private async getBankAccountOrFetch(
    params: {
      id: string;
      partnerId: string;
      data: Record<string, any>;
    },
    session: SessionEntity,
  ): Promise<BankAccountModel> {
    if (params.data) return BankAccountModel.fromJson(params.data);
    return this.bankService.getBankAccount(
      {
        partnerId: params.partnerId,
        id: params.id,
      },
      session,
    );
  }

  private async getPaymentMethodOrFetch(
    params: {
      id: string;
      data: Record<string, any>;
    },
    session: SessionEntity,
  ): Promise<PaymentGatewayModel> {
    if (params.data) return PaymentGatewayModel.fromJson(params.data);
    return this.paymentGatewayService.get({ id: params.id }, session);
  }

  private async getPaymentSchemeOrFetch(
    params: {
      id: string;
      gatewayId: string;
      data: Record<string, any>;
    },
    session: SessionEntity,
  ): Promise<PaymentSchemeModel | undefined> {
    if (!params.id) return undefined; // It means it is not require to have PaymentScheme
    if (params.data) return PaymentSchemeModel.fromJson(params.data);
    return this.paymentGatewayService.getScheme(
      {
        id: params.id,
        gatewayId: params.gatewayId,
      },
      session,
    );
  }
}
