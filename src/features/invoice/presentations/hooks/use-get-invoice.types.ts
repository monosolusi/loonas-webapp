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
  refresh: () => Promise<void>;
};

type LoadedState = {
  invoice: InvoiceDetailEntity;
  loading: false;
  error: null;
  refresh: () => Promise<void>;
};

type ErrorState = {
  invoice: null;
  loading: false;
  error: ServerError;
  refresh: () => Promise<void>;
};

export type UseGetInvoiceReturnType = InitialState | LoadedState | ErrorState;
