import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { InvoiceModel } from "@/features/invoice/data/models/invoice";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { DateTime } from "luxon";
import { OutgoingInvoiceModel } from "@/features/invoice/data/models/outgoing-invoice";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { ChargeFeeOn } from "@/features/invoice/domain/enums/charge-fee-on";
import { InvoiceSendChannel } from "@/features/invoice/domain/enums/invoice-send-channel";
import { CombinedInvoiceSummaryModel } from "@/features/invoice/data/models/combined-invoice-summary";
import { DiscountType } from "@/features/invoice/domain/enums/discount-type";
import { PublicOutgoingInvoiceModel } from "../../data/models/public-outgoing-invoice";
import { PayInModel } from "../../data/models/pay-in";

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
  sendChannel: InvoiceSendChannel[];
}

export interface CombinedInvoiceSummaryFilter {
  id: string;
}

export interface OutgoingInvoiceFilter {
  id?: string;
}

export interface InvoiceService {
  list(
    filter: InvoiceServiceFilter,
    params: InvoiceServiceFilterParams,
    session: SessionEntity,
  ): Promise<InvoiceModel[]>;

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
}
