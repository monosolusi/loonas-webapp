import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { InvoiceModel } from "@/features/invoice/data/models/invoice";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { DiscountType } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { DateTime } from "luxon";
import { OutgoingInvoiceModel } from "@/features/invoice/data/models/outgoing-invoice";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { ChargeFeeOn } from "@/features/invoice/domain/enums/charge-fee-on";
import { InvoiceSendChannel } from "@/features/invoice/domain/enums/invoice-send-channel";

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
}
