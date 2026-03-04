import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { InvoiceModel } from "@/features/invoice/data/models/invoice";
import {
  CashFlowFilter,
  CombinedInvoiceSummaryFilter,
  CreateOutgoingParams,
  InvoiceService,
  InvoiceServiceFilter,
  InvoiceServiceFilterParams,
  InvoiceSummaryFilter,
  ListInvoicesServiceFilter,
  OutgoingInvoiceFilter,
} from "@/features/invoice/domain/sources/invoice";
import { InvoiceSummaryModel } from "@/features/invoice/data/models/invoice-summary";
import { CashFlowModel } from "@/features/invoice/data/models/cash-flow";
import { PaginationMetaModel } from "@/core/resources/pagination-meta-model";
import { OutgoingInvoiceModel } from "../models/outgoing-invoice";
import { HttpRequest } from "@/core/helpers/http-request";
import { InvoiceItemModel } from "@/features/invoice/data/models/invoice-item";
import { FileModel } from "@/features/file/data/models/file";
import { CombinedInvoiceSummaryModel } from "../models/combined-invoice-summary";
import { InvoiceItemSummaryModel } from "@/features/invoice/data/models/invoice-item-summary";
import { InvoiceSenderModel } from "@/features/invoice/data/models/invoice-sender";
import { InvoiceRecipientModel } from "@/features/invoice/data/models/invoice-recipient";
import { PublicOutgoingInvoiceModel } from "../models/public-outgoing-invoice";
import { PayInModel } from "../models/pay-in";
import { InvoiceTimelineModel } from "../models/invoice-timeline";
import { NotificationChannel } from "@/features/notification/domain/enums/notification-channel";
import { InvoiceListItemModel } from "@/features/invoice/data/types/invoice-list-item-model";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";

export class InvoiceServiceImpl implements InvoiceService {
  constructor(private readonly http: HttpRequest) {}

  public async list(
    filter: ListInvoicesServiceFilter,
    session: SessionEntity,
  ): Promise<{ data: InvoiceListItemModel[]; meta: PaginationMetaModel }> {
    try {
      const path = "/invoices";
      const method = "GET";
      const searchParams: Record<string, string> = {};
      if (filter.type) searchParams.type = filter.type;
      if (filter.page) searchParams.page = String(filter.page);
      if (filter.limit) searchParams.limit = String(filter.limit);
      if (filter.includes) searchParams.include = filter.includes;

      const result = await this.http.request({ path, method, searchParams, session });
      if (!result) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

      const data = (result.data as Record<string, any>[]).map((item) => this.parseInvoiceListItem(item));
      const meta = PaginationMetaModel.fromJson(result.meta);

      return { data, meta };
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  private parseInvoiceListItem(doc: Record<string, any>): InvoiceListItemModel {
    switch (doc.type) {
      case InvoiceType.OUTGOING:
        return this.parseOutgoingInvoiceFromListItem(doc);
      case InvoiceType.INCOMING:
      default:
        return InvoiceModel.fromJson(doc);
    }
  }

  private parseOutgoingInvoiceFromListItem(doc: Record<string, any>): OutgoingInvoiceModel {
    if (doc.signature) doc.signature = FileModel.fromJson(doc.signature);
    if (doc.pdf) doc.pdf = FileModel.fromJson(doc.pdf);
    if (doc.items) doc.items = doc.items.map(InvoiceItemModel.fromJson);
    if (doc.recipient) doc.recipient = InvoiceRecipientModel.fromJson(doc.recipient);
    if (doc.summary) doc.summary = InvoiceItemSummaryModel.fromJson(doc.summary);
    if (doc.sender) doc.sender = InvoiceSenderModel.fromJson(doc.sender);

    return OutgoingInvoiceModel.fromJson(doc, {
      items: doc.items ?? [],
      recipient: doc.recipient,
      signature: doc.signature,
      summary: doc.summary,
      sender: doc.sender,
      pdf: doc.pdf,
    });
  }

  public async send(params: { id: string; sendChannel: NotificationChannel[] }, session: SessionEntity): Promise<void> {
    const path = `/invoices/outgoing/${params.id}/send`;
    const body = { channels: params.sendChannel };
    const method = "POST";

    await this.http.request({ path, method, body, session });
  }

  public async createPayInForOutgoingInvoice(params: {
    invoiceId: string;
    paymentMethodId: string;
    paymentSchemeId?: string | null;
  }): Promise<PayInModel> {
    const path = `/invoices/public-outgoing/${params.invoiceId}/pay-in`;
    const method = "POST";
    const body = {
      payment_method_id: params.paymentMethodId,
      ...(params.paymentSchemeId && { payment_scheme_id: params.paymentSchemeId }),
    };

    const config = { requireAuth: false, requireAccount: false, contentType: "application/json" };
    const result = await this.http.request({ path, method, body }, config);

    if (!result) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    if (!result.id) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
    return PayInModel.fromJson(result);
  }

  public async getPublicOutgoing(filter: { invoiceId: string }): Promise<PublicOutgoingInvoiceModel> {
    const path = `/invoices/public-outgoing/${filter.invoiceId}`;
    const method = "GET";

    const config = { requireAuth: false, requireAccount: false };
    const result = await this.http.request({ path, method }, config);
    return PublicOutgoingInvoiceModel.fromJson(result);
  }

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
    if (result.pdf) result.pdf = FileModel.fromJson(result.pdf);
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
      pdf: result.pdf,
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
          { contentType: undefined },
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

      let pdf: FileModel | undefined;
      if (finaliseResult.pdf) pdf = FileModel.fromJson(finaliseResult.pdf);

      return OutgoingInvoiceModel.fromJson(finaliseResult, { items, recipient, signature, summary, sender, pdf });
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async getTimeline(filter: { id: string }, session: SessionEntity): Promise<InvoiceTimelineModel> {
    try {
      const path = `/invoices/${filter.id}/timeline`;
      const method = "GET";
      const result = await this.http.request({ path, method, session });
      if (!result) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return InvoiceTimelineModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async getSummary(filter: InvoiceSummaryFilter, session: SessionEntity): Promise<InvoiceSummaryModel> {
    try {
      const path = "/invoices/summary";
      const method = "GET";
      const searchParams: Record<string, string> = { type: filter.type };

      const result = await this.http.request({ path, method, searchParams, session });
      if (!result) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return InvoiceSummaryModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

  public async getCashFlow(filter: CashFlowFilter, session: SessionEntity): Promise<CashFlowModel> {
    try {
      const path = "/invoices/cash-flow";
      const method = "GET";
      const searchParams: Record<string, string> = {};
      if (filter.month) searchParams.month = String(filter.month);
      if (filter.year) searchParams.year = String(filter.year);

      const result = await this.http.request({ path, method, searchParams, session });
      if (!result) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return CashFlowModel.fromJson(result);
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
      const path = `/invoices/${filter.id}`;
      const method = "GET";
      const searchParams = (params.includes && { include: params.includes }) || undefined;

      const result = await this.http.request({ path, method, searchParams, session });
      if (!result) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
      return InvoiceModel.fromJson(result);
    } catch (err) {
      if (err instanceof ServerError) throw err;
      else throw new ServerError(ErrorCodes.UNKNOWN, { error: err });
    }
  }

}
