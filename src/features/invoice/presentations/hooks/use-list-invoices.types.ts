import { useClerk } from "@clerk/nextjs";
import { ServerError } from "@/core/resources/server-error";
import { PaginationMeta } from "@/core/resources/paginated";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { InvoiceListItemEntity } from "@/features/invoice/domain/types/invoice-list-item";

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
  invoices: InvoiceListItemEntity[];
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
