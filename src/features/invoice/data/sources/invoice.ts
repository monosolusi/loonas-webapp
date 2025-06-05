import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { InvoiceModel } from "@/features/invoice/data/models/invoice";
import {
  CombinedInvoiceSummaryFilter,
  CreateOutgoingParams,
  InvoiceService,
  InvoiceServiceFilter,
  InvoiceServiceFilterParams,
  OutgoingInvoiceFilter,
} from "@/features/invoice/domain/sources/invoice";
import { OutgoingInvoiceModel } from "../models/outgoing-invoice";
import { HttpRequest } from "@/core/helpers/http-request";
import { InvoiceItemModel } from "@/features/invoice/data/models/invoice-item";
import { FileModel } from "@/features/file/data/models/file";
import { CombinedInvoiceSummaryModel } from "../models/combined-invoice-summary";
import { InvoiceItemSummaryModel } from "@/features/invoice/data/models/invoice-item-summary";
import { InvoiceSenderModel } from "@/features/invoice/data/models/invoice-sender";
import { InvoiceRecipientModel } from "@/features/invoice/data/models/invoice-recipient";

export class InvoiceServiceImpl implements InvoiceService {
  constructor(private readonly http: HttpRequest) {}

  public async getOutgoing(filter: OutgoingInvoiceFilter, session: SessionEntity): Promise<OutgoingInvoiceModel> {
    if (!filter.id) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

    const path = `/invoices/outgoing/${filter.id}`;
    const method = "GET";
    const result = await this.http.request({ path, method, session });
    if (!result) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

    if (!result.items) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    if (!result.recipient) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    if (!result.summary) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    if (result.signature) result.signature = FileModel.fromJson(result.signature);
    result.items = result.items.map(InvoiceItemModel.fromJson);
    result.recipient = InvoiceRecipientModel.fromJson(result.recipient);
    result.summary = InvoiceItemSummaryModel.fromJson(result.summary);
    result.sender = InvoiceSenderModel.fromJson(result.sender);

    return OutgoingInvoiceModel.fromJson(result, {
      items: result.items,
      recipient: result.recipient,
      signature: result.signature,
      summary: result.summary,
      sender: result.sender,
    });
  }

  public async getCombinedInvoiceSummary(
    filter: CombinedInvoiceSummaryFilter,
    session: SessionEntity,
  ): Promise<CombinedInvoiceSummaryModel> {
    const path = `/invoices/combined/${filter.id}`;
    const method = "GET";
    const result = await this.http.request({ path, method, session });
    if (!result) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return CombinedInvoiceSummaryModel.fromJson(result);
  }

  public async listCombinedInvoiceSummary(session: SessionEntity): Promise<CombinedInvoiceSummaryModel[]> {
    const path = "/invoices/combined";
    const method = "GET";
    const result = await this.http.request({ path, method, session });
    if (!result) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    if (!Array.isArray(result)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return result.map((item) => CombinedInvoiceSummaryModel.fromJson(item));
  }

  public async createOutgoing(params: CreateOutgoingParams, session: SessionEntity): Promise<OutgoingInvoiceModel> {
    try {
      const path = "/invoices/outgoing";
      const method = "POST";
      const body = {
        recipient_id: params.recipient.id,
        invoice_number: params.invoiceNumber,
        invoice_date: params.invoiceDate.toISO(),
        due_date: params.dueDate.toISO(),
        items: params.items.map((item) => ({
          name: item.name,
          description: item.description,
          qty: item.qty,
          price: item.price,
          tax_type: item.taxType,
          tax_base: item.taxBase,
          tax: item.tax,
          discount_type: item.discountType,
          discount: item.discount,
          total: item.total,
        })),
        note: params.note,
        tnc: params.tnc,
        payment_configuration: params.paymentConfiguration.map((config) => ({
          payment_method_id: config.paymentMethod.id,
          is_enabled: config.isEnabled,
          charge_fee_on: config.chargeFeeOn,
        })),
        send_channel: params.sendChannel,
      };

      const result = await this.http.request({ path, method, body, session });
      if (!result) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      if (!result.id) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      // Now we will upload the signature
      let signature: FileModel | undefined;
      if (params.signature) {
        const signaturePath = `/invoices/outgoing/${result.id}/signature`;
        const signatureMethod = "POST";
        const signatureBody = new FormData();
        signatureBody.append("signature", params.signature);

        const signatureResult = await this.http.request(
          {
            path: signaturePath,
            method: signatureMethod,
            body: signatureBody,
            session,
          },
          { inferContentType: false },
        );

        if (!signatureResult) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
        signature = FileModel.fromJson(signatureResult);
      }

      const finalisePath = `/invoices/outgoing/${result.id}/finalise`;
      const finaliseMethod = "POST";
      const finaliseResult = await this.http.request({ path: finalisePath, method: finaliseMethod, session });
      if (!finaliseResult) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      // Generate InvoiceItemModel[] from result.items
      const items = finaliseResult.items.map(InvoiceItemModel.fromJson);
      const recipient = InvoiceRecipientModel.fromJson(finaliseResult.recipient);
      const summary = InvoiceItemSummaryModel.fromJson(finaliseResult.summary);
      const sender = InvoiceSenderModel.fromJson(finaliseResult.sender);

      return OutgoingInvoiceModel.fromJson(finaliseResult, { items, recipient, signature, summary, sender });
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async get(
    filter: InvoiceServiceFilter,
    params: Pick<InvoiceServiceFilterParams, "includes">,
    session: SessionEntity,
  ): Promise<InvoiceModel> {
    try {
      if (!session.selectedAccount) throw new ServerError(ErrorCodes.NO_SELECTED_ACCOUNT);
      if (!filter.id) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = new URL(`${baseUrl}/invoices/${filter.id}`);
      if (params.includes) url.searchParams.set("include", params.includes);

      const method = "GET";
      const headers = {
        Authorization: `Bearer ${session.accessToken}`,
        "X-Account-Id": session.selectedAccount.id,
      };

      const response = await fetch(url, { method, headers });
      if (!response.ok) {
        const data = await response.json();
        if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });

        const ErrorCode = ErrorCodes.find(data.code);
        if (ErrorCode) throw new ServerError(ErrorCode);

        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }

      const data = await response.json();
      if (!data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return InvoiceModel.fromJson(data);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async list(
    filter: InvoiceServiceFilter,
    params: InvoiceServiceFilterParams,
    session: SessionEntity,
  ): Promise<InvoiceModel[]> {
    try {
      if (!session.selectedAccount) throw new ServerError(ErrorCodes.NO_SELECTED_ACCOUNT);

      const baseUrl = process.env.NEXT_PUBLIC_BASE_API_URL;
      if (!baseUrl) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const url = new URL(`${baseUrl}/invoices`);
      if (params.limit) url.searchParams.set("limit", params.limit.toString());

      const method = "GET";
      const headers = {
        Authorization: `Bearer ${session.accessToken}`,
        "X-Account-Id": session.selectedAccount.id,
      };

      const response = await fetch(url, { method, headers });
      if (!response.ok) {
        const data = await response.json();
        if (!data) throw new ServerError(ErrorCodes.UNKNOWN, { code: response.status });

        const ErrorCode = ErrorCodes.find(data.code);
        if (ErrorCode) throw new ServerError(ErrorCode);

        throw new ServerError(ErrorCodes.UNKNOWN, { code: data.code, message: data.message });
      }

      const data = await response.json();
      if (!data || !Array.isArray(data)) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return data.map((item) => InvoiceModel.fromJson(item));
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }
}
