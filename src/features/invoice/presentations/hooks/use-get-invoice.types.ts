import { useClerk } from "@clerk/nextjs";
import { InvoiceDetailEntity } from "@/features/invoice/domain/types/invoice-detail";
import { ServerError } from "@/core/resources/server-error";

export type UseGetInvoiceParams = {
  id: string;
  includes?: string;
};

export type GetInvoiceFetcherParams = UseGetInvoiceParams & {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  invoice: null;
  loading: true;
  error: null;
};

type LoadedState = {
  invoice: InvoiceDetailEntity;
  loading: false;
  error: null;
};

type ErrorState = {
  invoice: null;
  loading: false;
  error: ServerError;
};

export type UseGetInvoiceReturnType = InitialState | LoadedState | ErrorState;
