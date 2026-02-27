import { useClerk } from "@clerk/nextjs";
import { InvoiceEntity } from "@/features/invoice/domain/entities/invoice";
import { ServerError } from "@/core/resources/server-error";
import { PaginationMeta } from "@/core/resources/paginated";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";

export type UseListInvoicesParams = {
  type?: InvoiceType;
  page?: number;
  limit?: number;
  includes?: string;
};

export type ListInvoicesFetcherParams = UseListInvoicesParams & {
  clerk: ReturnType<typeof useClerk>;
};

type InitialState = {
  invoices: null;
  meta: null;
  loading: true;
  error: null;
};

type LoadedState = {
  invoices: InvoiceEntity[];
  meta: PaginationMeta;
  loading: false;
  error: null;
};

type ErrorState = {
  invoices: null;
  meta: null;
  loading: false;
  error: ServerError;
};

export type UseListInvoicesReturnType = InitialState | LoadedState | ErrorState;
