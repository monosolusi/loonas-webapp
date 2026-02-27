import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { DataState } from "@/core/resources/data-state";
import { InvoiceEntity } from "@/features/invoice/domain/entities/invoice";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { DateTime } from "luxon";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { ChargeFeeOn } from "@/features/invoice/domain/enums/charge-fee-on";
import { CombinedInvoiceSummaryEntity } from "@/features/invoice/domain/entities/combined-invoice-summary";
import { DiscountType } from "@/features/invoice/domain/enums/discount-type";
import { PublicOutgoingInvoiceEntity } from "../entities/public-outgoing-invoice";
import { PayInEntity } from "../entities/pay-in";
import { NotificationChannel } from "@/features/notification/domain/enums/notification-channel";
import { PaymentMethodPayInDetailEntity } from "@/features/payment/domain/entities/payment-method-pay-in-detail-entity";
import { InvoiceTimelineEntity } from "@/features/invoice/domain/entities/invoice-timeline";

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

export interface CombinedInvoiceSummaryFilter {
  id: string;
}

export interface OutgoingInvoiceFilter {
  id?: string;
}

export interface InvoiceRepository {
  get(
    filter: InvoiceRepositoryFilter,
    params: Pick<InvoiceRepositoryFilterParams, "includes">,
    session: SessionEntity,
  ): Promise<DataState<InvoiceEntity>>;

  createOutgoing(params: CreateOutgoingParams, session: SessionEntity): Promise<DataState<OutgoingInvoiceEntity>>;

  getOutgoing(filter: OutgoingInvoiceFilter, session: SessionEntity): Promise<DataState<OutgoingInvoiceEntity>>;

  listCombinedInvoiceSummary(session: SessionEntity): Promise<DataState<CombinedInvoiceSummaryEntity[]>>;

  getCombinedInvoiceSummary(
    filter: CombinedInvoiceSummaryFilter,
    session: SessionEntity,
  ): Promise<DataState<CombinedInvoiceSummaryEntity>>;

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
}
