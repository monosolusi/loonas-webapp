import { DataFailed, DataState, DataSuccess } from "@/core/resources/data-state";
import { SessionEntity } from "@/features/authentication/domain/entities/session";
import {
  CashFlowRepoFilter,
  CreateOutgoingParams,
  CreatePosSaleRepoParams,
  InvoiceRepository,
  InvoiceRepositoryFilter,
  InvoiceRepositoryFilterParams,
  InvoiceSummaryRepoFilter,
  ListInvoicesFilter,
} from "@/features/invoice/domain/repositories/invoice";
import { PaginatedData } from "@/core/resources/paginated";
import { InvoiceDetailEntity } from "@/features/invoice/domain/types/invoice-detail";
import { InvoiceListItemEntity } from "@/features/invoice/domain/types/invoice-list-item";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { InvoiceService } from "@/features/invoice/domain/sources/invoice";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";

import { PublicOutgoingInvoiceEntity } from "@/features/invoice/domain/entities/public-outgoing-invoice";
import { PublicIncomingInvoiceEntity } from "@/features/invoice/domain/entities/public-incoming-invoice";
import { PayInEntity } from "@/features/invoice/domain/entities/pay-in";
import { NotificationChannel } from "@/features/notification/domain/enums/notification-channel";
import { PaymentMethodPayInDetailEntity } from "@/features/payment/domain/entities/payment-method-pay-in-detail-entity";
import { PayInDetailFactory } from "@/features/invoice/domain/factories/pay-in-detail-factory";
import { InvoiceTimelineEntity } from "@/features/invoice/domain/entities/invoice-timeline";
import { InvoiceSummaryEntity } from "@/features/invoice/domain/entities/invoice-summary";
import { CashFlowEntity } from "@/features/invoice/domain/entities/cash-flow";

export class InvoiceRepositoryImpl implements InvoiceRepository {
  constructor(
    private readonly invoiceService: InvoiceService,
    private readonly payInDetailFactory: PayInDetailFactory,
  ) {}

  public async list(
    filter: ListInvoicesFilter,
    session: SessionEntity,
  ): Promise<DataState<PaginatedData<InvoiceListItemEntity>>> {
    try {
      const result = await this.invoiceService.list(
        {
          type: filter.type,
          channel: filter.channel,
          page: filter.page,
          limit: filter.limit,
          includes: filter.includes,
          filter: filter.filter,
          from: filter.from,
          to: filter.to,
        },
        session,
      );
      return new DataSuccess({
        data: result.data.map((invoice) => invoice.toEntity()),
        meta: result.meta.toMeta(),
      });
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

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

  public async createPosSale(
    params: CreatePosSaleRepoParams,
    session: SessionEntity,
  ): Promise<DataState<OutgoingInvoiceEntity>> {
    try {
      const result = await this.invoiceService.createPosSale(params, session);
      return new DataSuccess(result.toEntity());
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

  public async getPublicIncoming(filter: { invoiceId: string }): Promise<DataState<PublicIncomingInvoiceEntity>> {
    try {
      const invoice = await this.invoiceService.getPublicIncoming(filter);
      return new DataSuccess(invoice.toEntity());
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

  public async finalise(
    params: { id: string },
    session: SessionEntity,
  ): Promise<DataState<OutgoingInvoiceEntity>> {
    try {
      const invoice = await this.invoiceService.finalise({ id: params.id }, session);
      return new DataSuccess(invoice.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async getSummary(
    filter: InvoiceSummaryRepoFilter,
    session: SessionEntity,
  ): Promise<DataState<InvoiceSummaryEntity>> {
    try {
      const summary = await this.invoiceService.getSummary({ type: filter.type }, session);
      return new DataSuccess(summary.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

  public async getCashFlow(
    filter: CashFlowRepoFilter,
    session: SessionEntity,
  ): Promise<DataState<CashFlowEntity>> {
    try {
      const cashFlow = await this.invoiceService.getCashFlow({ month: filter.month, year: filter.year }, session);
      return new DataSuccess(cashFlow.toEntity());
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
  ): Promise<DataState<InvoiceDetailEntity>> {
    try {
      const invoice = await this.invoiceService.get(filter, params, session);
      return new DataSuccess(invoice.toEntity());
    } catch (err) {
      if (err instanceof ServerError) return new DataFailed(err);
      else return new DataFailed(new ServerError(ErrorCodes.UNKNOWN, { error: err }));
    }
  }

}
