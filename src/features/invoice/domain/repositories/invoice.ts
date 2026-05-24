import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { DataState } from "@/core/resources/data-state";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { InvoiceDetailEntity } from "@/features/invoice/domain/types/invoice-detail";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { DateTime } from "luxon";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { ChargeFeeOn } from "@/features/invoice/domain/enums/charge-fee-on";

import { DiscountType } from "@/features/invoice/domain/enums/discount-type";
import { PublicOutgoingInvoiceEntity } from "../entities/public-outgoing-invoice";
import { PublicIncomingInvoiceEntity } from "../entities/public-incoming-invoice";
import { PayInEntity } from "../entities/pay-in";
import { NotificationChannel } from "@/features/notification/domain/enums/notification-channel";
import { PaymentMethodPayInDetailEntity } from "@/features/payment/domain/entities/payment-method-pay-in-detail-entity";
import { InvoiceTimelineEntity } from "@/features/invoice/domain/entities/invoice-timeline";
import { PaginatedData } from "@/core/resources/paginated";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { InvoiceChannel } from "@/features/invoice/domain/enums/invoice-channel";
import { InvoiceListItemEntity } from "@/features/invoice/domain/types/invoice-list-item";
import { InvoiceSummaryEntity } from "@/features/invoice/domain/entities/invoice-summary";
import { CashFlowEntity } from "@/features/invoice/domain/entities/cash-flow";

export interface InvoiceItem {
  name: string;
  description?: string;
  qty: number;
  price: number;
  taxType: TaxType;
  taxBase: number;
  tax: number;
  discountType?: DiscountType;
  discount?: number;
  total: number;
}

export interface PaymentConfiguration {
  paymentMethod: PaymentGatewayEntity;
  isEnabled: boolean;
  chargeFeeOn: ChargeFeeOn;
}

export interface InvoiceRepositoryFilter {
  id?: string;
}

export interface InvoiceRepositoryFilterParams {
  limit?: number;
  includes?: string;
}

export interface CreateOutgoingParams {
  recipient: PartnerEntity;
  invoiceNumber: string;
  invoiceDate: DateTime;
  dueDate: DateTime;
  items: InvoiceItem[];
  note?: string;
  tnc?: string;
  signature?: File;
  paymentConfiguration: PaymentConfiguration[];
  sendChannel: NotificationChannel[];
}


export interface OutgoingInvoiceFilter {
  id?: string;
}

export interface InvoiceSummaryRepoFilter {
  type: InvoiceType;
}

export interface CashFlowRepoFilter {
  month?: number;
  year?: number;
}

export interface ListInvoicesFilter {
  type?: InvoiceType;
  channel?: InvoiceChannel;
  page?: number;
  limit?: number;
  includes?: string;
  filter?: string;
  from?: string; // YYYY-MM-DD, Asia/Jakarta
  to?: string;   // YYYY-MM-DD, Asia/Jakarta; must pair with `from`
}

export interface CreatePosSaleItemRepoParams {
  variantId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

export interface CreatePosSaleRepoParams {
  date: string;
  paymentGatewayId: string;
  discount: number;
  note?: string;
  tenderedAmount?: number;
  items: CreatePosSaleItemRepoParams[];
  idempotencyKey: string;
}

export interface InvoiceRepository {
  list(filter: ListInvoicesFilter, session: SessionEntity): Promise<DataState<PaginatedData<InvoiceListItemEntity>>>;

  get(
    filter: InvoiceRepositoryFilter,
    params: Pick<InvoiceRepositoryFilterParams, "includes">,
    session: SessionEntity,
  ): Promise<DataState<InvoiceDetailEntity>>;

  createOutgoing(params: CreateOutgoingParams, session: SessionEntity): Promise<DataState<OutgoingInvoiceEntity>>;

  createPosSale(params: CreatePosSaleRepoParams, session: SessionEntity): Promise<DataState<OutgoingInvoiceEntity>>;

  getOutgoing(filter: OutgoingInvoiceFilter, session: SessionEntity): Promise<DataState<OutgoingInvoiceEntity>>;

  getPublicOutgoing(filter: { invoiceId: string }): Promise<DataState<PublicOutgoingInvoiceEntity>>;

  createPayInForOutgoingInvoice(params: {
    invoiceId: string;
    paymentMethodId: string;
    paymentSchemeId?: string | null;
  }): Promise<DataState<PayInEntity>>;

  send(params: { id: string; sendChannel: NotificationChannel[] }, session: SessionEntity): Promise<DataState<boolean>>;

  getPayInDetail(
    params: { invoice: { id: string } },
    session: SessionEntity,
  ): Promise<DataState<PaymentMethodPayInDetailEntity>>;

  getTimeline(filter: { id: string }, session: SessionEntity): Promise<DataState<InvoiceTimelineEntity>>;

  getSummary(filter: InvoiceSummaryRepoFilter, session: SessionEntity): Promise<DataState<InvoiceSummaryEntity>>;

  getCashFlow(filter: CashFlowRepoFilter, session: SessionEntity): Promise<DataState<CashFlowEntity>>;

  getPublicIncoming(filter: { invoiceId: string }): Promise<DataState<PublicIncomingInvoiceEntity>>;
}
