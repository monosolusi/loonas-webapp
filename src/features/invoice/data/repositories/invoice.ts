import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import {
  CombinedInvoiceSummaryFilter,
  CreateOutgoingParams,
  InvoiceRepository,
  InvoiceRepositoryFilter,
  InvoiceRepositoryFilterParams,
  OutgoingInvoiceFilter,
} from "@/features/invoice/domain/repositories/invoice";
import { InvoiceEntity } from "../../domain/entities/invoice";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { InvoiceService } from "@/features/invoice/domain/sources/invoice";
import { OutgoingInvoiceEntity } from "../../domain/entities/outgoing-invoice";
import { CombinedInvoiceSummaryEntity } from "../../domain/entities/combined-invoice-summary";
import { PublicOutgoingInvoiceEntity } from "../../domain/entities/public-outgoing-invoice";
import { PayInEntity } from "../../domain/entities/pay-in";
import { NotificationChannel } from "@/features/notification/domain/enums/notification-channel";
import { PaymentMethodPayInDetailEntity } from "@/features/payment/domain/entities/payment-method-pay-in-detail-entity";
import { PayInDetailFactory } from "@/features/invoice/domain/factories/pay-in-detail-factory";
import { InvoiceTimelineEntity } from "../../domain/entities/invoice-timeline";

export class InvoiceRepositoryImpl implements InvoiceRepository {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly payInDetailFactory: PayInDetailFactory,
  ) {}

  public async getPayInDetail(
    params: { invoice: { id: string } },
    session: SessionEntity,
  ): Promise<DataState<PaymentMethodPayInDetailEntity>> {
    try {
      const invoice = await this.invoiceService.get({ id: params.invoice.id }, {}, session);
      const service = this.payInDetailFactory.getService({ type: invoice.type });
      const payInDetail = await service.get({ invoice: { id: invoice.id } }, session);
      return new DataSuccess(payInDetail.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async send(
    params: {
      id: string;
      sendChannel: NotificationChannel[];
    },
    session: SessionEntity,
  ): Promise<DataState<boolean>> {
    try {
      await this.invoiceService.send({ id: params.id, sendChannel: params.sendChannel }, session);
      return new DataSuccess(true);
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async createPayInForOutgoingInvoice(params: {
    invoiceId: string;
    paymentMethodId: string;
    paymentSchemeId?: string | null;
  }): Promise<DataState<PayInEntity>> {
    try {
      const payIn = await this.invoiceService.createPayInForOutgoingInvoice({
        invoiceId: params.invoiceId,
        paymentMethodId: params.paymentMethodId,
        paymentSchemeId: params.paymentSchemeId || null,
      });

      return new DataSuccess(payIn.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async getPublicOutgoing(filter: { invoiceId: string }): Promise<DataState<PublicOutgoingInvoiceEntity>> {
    try {
      const invoice = await this.invoiceService.getPublicOutgoing(filter);
      return new DataSuccess(invoice.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async getOutgoing(
    filter: OutgoingInvoiceFilter,
    session: SessionEntity,
  ): Promise<DataState<OutgoingInvoiceEntity>> {
    try {
      const invoice = await this.invoiceService.getOutgoing(filter, session);
      return new DataSuccess(invoice.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async getCombinedInvoiceSummary(
    filter: CombinedInvoiceSummaryFilter,
    session: SessionEntity,
  ): Promise<DataState<CombinedInvoiceSummaryEntity>> {
    try {
      const invoice = await this.invoiceService.getCombinedInvoiceSummary(filter, session);
      return new DataSuccess(invoice.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async listCombinedInvoiceSummary(session: SessionEntity): Promise<DataState<CombinedInvoiceSummaryEntity[]>> {
    try {
      const invoices = await this.invoiceService.listCombinedInvoiceSummary(session);
      return new DataSuccess(invoices.map((invoice) => invoice.toEntity()));
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async createOutgoing(
    params: CreateOutgoingParams,
    session: SessionEntity,
  ): Promise<DataState<OutgoingInvoiceEntity>> {
    try {
      const invoice = await this.invoiceService.createOutgoing(
        {
          recipient: params.recipient,
          invoiceNumber: params.invoiceNumber,
          invoiceDate: params.invoiceDate,
          dueDate: params.dueDate,
          items: params.items.map((item) => ({
            name: item.name,
            description: item.description,
            qty: item.qty,
            price: item.price,
            taxType: item.taxType,
            taxBase: item.taxBase,
            tax: item.tax,
            discountType: item.discountType,
            discount: item.discount,
            total: item.total,
          })),
          note: params.note,
          tnc: params.tnc,
          signature: params.signature,
          paymentConfiguration: params.paymentConfiguration.map((config) => ({
            paymentMethod: config.paymentMethod,
            isEnabled: config.isEnabled,
            chargeFeeOn: config.chargeFeeOn,
          })),
          sendChannel: params.sendChannel,
        },
        session,
      );
      return new DataSuccess(invoice.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async getTimeline(filter: { id: string }, session: SessionEntity): Promise<DataState<InvoiceTimelineEntity>> {
    try {
      const timeline = await this.invoiceService.getTimeline(filter, session);
      return new DataSuccess(timeline.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async get(
    filter: InvoiceRepositoryFilter,
    params: Pick<InvoiceRepositoryFilterParams, "includes">,
    session: SessionEntity,
  ): Promise<DataState<InvoiceEntity>> {
    try {
      const invoice = await this.invoiceService.get(filter, params, session);
      return new DataSuccess(invoice.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async list(
    filter: InvoiceRepositoryFilter,
    params: InvoiceRepositoryFilterParams,
    session: SessionEntity,
  ): Promise<DataState<InvoiceEntity[]>> {
    try {
      const invoices = await this.invoiceService.list(filter, params, session);
      return new DataSuccess(invoices.map((invoice) => invoice.toEntity()));
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }
}
