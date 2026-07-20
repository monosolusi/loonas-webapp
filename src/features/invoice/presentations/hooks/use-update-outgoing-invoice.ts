import useSWRMutation from "swr/mutation";
import { DateTime } from "luxon";
import { useClerk } from "@clerk/nextjs";
import { PartnerEntity } from "@/features/partner/domain/entities/partner";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { ClerkSessionService } from "@/features/authentication/data/sources/clerk-session.service";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { InvoiceServiceImpl } from "@/features/invoice/data/sources/invoice";
import { InvoiceRepositoryImpl } from "@/features/invoice/data/repositories/invoice";
import { DataFailed } from "@/core/resources/data-state";
import {
  UpdateOutgoingInvoiceUseCase,
  UpdateOutgoingInvoiceUseCaseParams,
} from "@/features/invoice/domain/usecases/update-outgoing-invoice.usecases";
import { HttpRequest } from "@/core/helpers/http-request";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { ChargeFeeOn } from "@/features/invoice/domain/enums/charge-fee-on";
import { DiscountType } from "@/features/invoice/domain/enums/discount-type";
import { PayInDetailFactory } from "@/features/invoice/domain/factories/pay-in-detail-factory";
import { INVOICE_SWR_KEYS } from "@/features/invoice/presentations/constants/swr-keys";

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

interface UpdateOutgoingInvoiceFetcherParams {
  arg: {
    id: string;
    recipient: PartnerEntity;
    invoiceDate: DateTime;
    dueDate: DateTime;
    items: InvoiceItem[];
    note?: string;
    tnc?: string;
    signature?: File;
    paymentConfiguration: PaymentConfiguration[];
  };
}

async function updateOutgoingInvoiceFetcher(
  [_, params]: [string, { clerk: ReturnType<typeof useClerk> }],
  { arg }: UpdateOutgoingInvoiceFetcherParams,
) {
  if (!arg.id) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  if (!arg.recipient) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  if (!arg.invoiceDate) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  if (!arg.dueDate) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  if (!arg.items || !arg.items.length) throw new ServerError(ErrorCodes.INVALID_INSTANCE);

  const httpRequest = new HttpRequest();
  const sessionService = new ClerkSessionService({ clerk: params.clerk });
  const sessionRepository = new SessionRepositoryImpl(sessionService);
  const invoiceService = new InvoiceServiceImpl(httpRequest);
  const invoiceRepository = new InvoiceRepositoryImpl(invoiceService, new PayInDetailFactory());
  const update = new UpdateOutgoingInvoiceUseCase(invoiceRepository, sessionRepository);
  const updateParams = new UpdateOutgoingInvoiceUseCaseParams({
    id: arg.id,
    recipient: arg.recipient,
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
  });

  const result = await update.execute(updateParams);
  if (result instanceof DataFailed) throw result.error;
  if (!result.data) throw new ServerError(ErrorCodes.INVALID_INSTANCE);
  return result.data;
}

export function useUpdateOutgoingInvoice() {
  const clerk = useClerk();
  return useSWRMutation([INVOICE_SWR_KEYS.UPDATE_INVOICE, { clerk }], updateOutgoingInvoiceFetcher);
}
