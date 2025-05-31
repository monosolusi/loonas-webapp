import { SessionEntity } from "@/features/authentication/domain/entities/session";
import { DataState } from "@/core/resources/data-state";
import { InvoiceEntity } from "@/features/invoice/domain/entities/invoice";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { DiscountType } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { DateTime } from "luxon";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { ChargeFeeOn } from "@/features/invoice/domain/enums/charge-fee-on";
import { InvoiceSendChannel } from "@/features/invoice/domain/enums/invoice-send-channel";

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
  sendChannel: InvoiceSendChannel[];
}

export interface InvoiceRepository {
  list(
    filter: InvoiceRepositoryFilter,
    params: InvoiceRepositoryFilterParams,
    session: SessionEntity,
  ): Promise<DataState<InvoiceEntity[]>>;

  get(
    filter: InvoiceRepositoryFilter,
    params: Pick<InvoiceRepositoryFilterParams, "includes">,
    session: SessionEntity,
  ): Promise<DataState<InvoiceEntity>>;

  createOutgoing(params: CreateOutgoingParams, session: SessionEntity): Promise<DataState<OutgoingInvoiceEntity>>;
}
