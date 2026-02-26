import { useClerk } from "@clerk/nextjs";
import { InvoiceEntity } from "@/features/invoice/domain/entities/invoice";
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
  invoice: InvoiceEntity;
  loading: false;
  error: null;
};

type ErrorState = {
  invoice: null;
  loading: false;
  error: ServerError;
};

export type UseGetInvoiceReturnType = InitialState | LoadedState | ErrorState;
