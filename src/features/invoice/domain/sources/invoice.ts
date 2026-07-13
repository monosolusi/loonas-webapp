import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { InvoiceDetailModel } from "@/features/invoice/data/types/invoice-detail-model";
import { InvoiceTimelineModel } from "@/features/invoice/data/models/invoice-timeline";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { DateTime } from "luxon";
import { OutgoingInvoiceModel } from "@/features/invoice/data/models/outgoing-invoice";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { ChargeFeeOn } from "@/features/invoice/domain/enums/charge-fee-on";

import { DiscountType } from "@/features/invoice/domain/enums/discount-type";
import { PublicOutgoingInvoiceModel } from "@/features/invoice/data/models/public-outgoing-invoice";
import { PublicIncomingInvoiceModel } from "@/features/invoice/data/models/public-incoming-invoice";
import { PayInModel } from "@/features/invoice/data/models/pay-in";
import { NotificationChannel } from "@/features/notification/domain/enums/notification-channel";
import { PaginationMetaModel } from "@/core/resources/pagination-meta-model";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { InvoiceChannel } from "@/features/invoice/domain/enums/invoice-channel";
import { InvoiceListItemModel } from "@/features/invoice/data/types/invoice-list-item-model";
import { InvoiceSummaryModel } from "@/features/invoice/data/models/invoice-summary";
import { CashFlowModel } from "@/features/invoice/data/models/cash-flow";

export interface InvoiceServiceFilter {
  id?: string;
}

export interface InvoiceServiceFilterParams {
  limit?: number;
  includes?: string;
}

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


export interface InvoiceSummaryFilter {
  type: InvoiceType;
}

export interface CashFlowFilter {
  month?: number;
  year?: number;
}

export interface ListInvoicesServiceFilter {
  type?: InvoiceType;
  channel?: InvoiceChannel;
  page?: number;
  limit?: number;
  includes?: string;
  filter?: string;
  from?: string; // YYYY-MM-DD, Asia/Jakarta
  to?: string;   // YYYY-MM-DD, Asia/Jakarta; must pair with `from`
}

export interface CreatePosSaleItemServiceParams {
  variantId: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

export interface CreatePosSaleServiceParams {
  date: string;
  paymentGatewayId: string;
  discount: number;
  note?: string;
  tenderedAmount?: number;
  items: CreatePosSaleItemServiceParams[];
  idempotencyKey: string;
}

export interface InvoiceService {
  list(
    filter: ListInvoicesServiceFilter,
    session: SessionEntity,
  ): Promise<{ data: InvoiceListItemModel[]; meta: PaginationMetaModel }>;

  get(
    filter: InvoiceServiceFilter,
    params: Pick<InvoiceServiceFilterParams, "includes">,
    session: SessionEntity,
  ): Promise<InvoiceDetailModel>;

  createOutgoing(params: CreateOutgoingParams, session: SessionEntity): Promise<OutgoingInvoiceModel>;

  createPosSale(params: CreatePosSaleServiceParams, session: SessionEntity): Promise<OutgoingInvoiceModel>;

  getPublicOutgoing(filter: { invoiceId: string }): Promise<PublicOutgoingInvoiceModel>;

  createPayInForOutgoingInvoice(params: {
    invoiceId: string;
    paymentMethodId: string;
    paymentSchemeId?: string | null;
  }): Promise<PayInModel>;

  send(params: { id: string; sendChannel: NotificationChannel[] }, session: SessionEntity): Promise<void>;

  finalise(params: { id: string }, session: SessionEntity): Promise<OutgoingInvoiceModel>;

  getTimeline(filter: { id: string }, session: SessionEntity): Promise<InvoiceTimelineModel>;

  getSummary(filter: InvoiceSummaryFilter, session: SessionEntity): Promise<InvoiceSummaryModel>;

  getCashFlow(filter: CashFlowFilter, session: SessionEntity): Promise<CashFlowModel>;

  getPublicIncoming(filter: { invoiceId: string }): Promise<PublicIncomingInvoiceModel>;
}
