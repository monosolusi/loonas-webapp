import { useClerk } from "@clerk/nextjs";
import { InvoiceSummaryEntity } from "@/features/invoice/domain/entities/invoice-summary";
import { ServerError } from "@/core/resources/server-error";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";

export type UseGetInvoiceSummaryParams = {
  type: InvoiceType;
};

export type GetInvoiceSummaryFetcherParams = UseGetInvoiceSummaryParams & {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  summary: null;
  loading: true;
  error: null;
};

type LoadedState = {
  summary: InvoiceSummaryEntity;
  loading: false;
  error: null;
};

type ErrorState = {
  summary: null;
  loading: false;
  error: ServerError;
};

export type UseGetInvoiceSummaryReturnType = InitialState | LoadedState | ErrorState;
