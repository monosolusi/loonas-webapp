import useSWRMutation from "swr/mutation";
import { DateTime } from "luxon";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { InvoiceServiceImpl } from "@/features/invoice/data/sources/invoice";
import { InvoiceRepositoryImpl } from "@/features/invoice/data/repositories/invoice";
import { DataFailed } from "@/core/resources/data-state";
import {
  CreateOutgoingInvoiceUseCase,
  CreateOutgoingInvoiceUseCaseParams,
} from "@/features/invoice/domain/usecases/create-outgoing-invoice";
import { HttpRequest } from "@/core/helpers/http-request";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { ChargeFeeOn } from "@/features/invoice/domain/enums/charge-fee-on";
import { InvoiceSendChannel } from "@/features/invoice/domain/enums/invoice-send-channel";
import { DiscountType } from "@/features/invoice/domain/enums/discount-type";

interface InvoiceItem {
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

interface PaymentConfiguration {
  paymentMethod: PaymentGatewayEntity;
  isEnabled: boolean;
  chargeFeeOn: ChargeFeeOn;
}

interface CreateOutgoingInvoiceFetcherParams {
  arg: {
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
  };
}

async function createOutgoingInvoiceFetcher(_: string, { arg }: CreateOutgoingInvoiceFetcherParams) {
  if (!arg.recipient) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  if (!arg.invoiceNumber) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  if (!arg.invoiceDate) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  if (!arg.dueDate) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  if (!arg.items) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  if (!arg.items.length) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  const httpRequest = new HttpRequest();
  const sessionService = new LocalStorageSessionService();
  const sessionRepository = new SessionRepositoryImpl(sessionService);
  const invoiceService = new InvoiceServiceImpl(httpRequest);
  const invoiceRepository = new InvoiceRepositoryImpl(invoiceService);
  const create = new CreateOutgoingInvoiceUseCase(invoiceRepository, sessionRepository);
  const createParams = new CreateOutgoingInvoiceUseCaseParams({
    recipient: arg.recipient,
    invoiceNumber: arg.invoiceNumber,
    invoiceDate: arg.invoiceDate,
    dueDate: arg.dueDate,
    items: arg.items.map((item) => ({
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
    note: arg.note,
    tnc: arg.tnc,
    signature: arg.signature,
    paymentConfiguration: arg.paymentConfiguration.map((config) => ({
      paymentMethod: config.paymentMethod,
      isEnabled: config.isEnabled,
      chargeFeeOn: config.chargeFeeOn,
    })),
    sendChannel: arg.sendChannel,
  });

  const result = await create.execute(createParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useCreateOutgoingInvoice() {
  return useSWRMutation("create-outgoing-invoice", createOutgoingInvoiceFetcher);
}
