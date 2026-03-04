import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { InvoiceModel } from "@/features/invoice/data/models/invoice";
import { InvoiceTimelineModel } from "@/features/invoice/data/models/invoice-timeline";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { DateTime } from "luxon";
import { OutgoingInvoiceModel } from "@/features/invoice/data/models/outgoing-invoice";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { ChargeFeeOn } from "@/features/invoice/domain/enums/charge-fee-on";
import { CombinedInvoiceSummaryModel } from "@/features/invoice/data/models/combined-invoice-summary";
import { DiscountType } from "@/features/invoice/domain/enums/discount-type";
import { PublicOutgoingInvoiceModel } from "../../data/models/public-outgoing-invoice";
import { PayInModel } from "../../data/models/pay-in";
import { NotificationChannel } from "@/features/notification/domain/enums/notification-channel";
import { PaginationMetaModel } from "@/core/resources/pagination-meta-model";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
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

export interface CombinedInvoiceSummaryFilter {
  id: string;
}

export interface OutgoingInvoiceFilter {
  id?: string;
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
  page?: number;
  limit?: number;
  includes?: string;
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
  ): Promise<InvoiceModel>;

  createOutgoing(params: CreateOutgoingParams, session: SessionEntity): Promise<OutgoingInvoiceModel>;

  getOutgoing(filter: OutgoingInvoiceFilter, session: SessionEntity): Promise<OutgoingInvoiceModel>;

  listCombinedInvoiceSummary(session: SessionEntity): Promise<CombinedInvoiceSummaryModel[]>;

  getCombinedInvoiceSummary(
    filter: CombinedInvoiceSummaryFilter,
    session: SessionEntity,
  ): Promise<CombinedInvoiceSummaryModel>;

  getPublicOutgoing(filter: { invoiceId: string }): Promise<PublicOutgoingInvoiceModel>;

  createPayInForOutgoingInvoice(params: {
    invoiceId: string;
    paymentMethodId: string;
    paymentSchemeId?: string | null;
  }): Promise<PayInModel>;

  send(params: { id: string; sendChannel: NotificationChannel[] }, session: SessionEntity): Promise<void>;

  getTimeline(filter: { id: string }, session: SessionEntity): Promise<InvoiceTimelineModel>;

  getSummary(filter: InvoiceSummaryFilter, session: SessionEntity): Promise<InvoiceSummaryModel>;

  getCashFlow(filter: CashFlowFilter, session: SessionEntity): Promise<CashFlowModel>;
}
