"use client";

import { createContext, useContext, useState } from "react";
import { PaginationMeta } from "@/core/resources/paginated";
import { ServerError } from "@/core/resources/server-error";
import { InvoiceChannel } from "@/features/invoice/domain/enums/invoice-channel";
import { InvoiceListItemEntity } from "@/features/invoice/domain/types/invoice-list-item";
import { useListInvoices } from "@/features/invoice/presentations/hooks/use-list-invoices";
import { usePosSalesRange } from "@/app/(authenticated)/sales/pos/_providers/pos-sales-range-provider";

const PAGE_SIZE = 25;

type PosSalesListContextValue = {
  invoices: InvoiceListItemEntity[];
  meta: PaginationMeta | null;
  loading: boolean;
  error: ServerError | null;
  page: number;
  setPage: (page: number) => void;
};

const PosSalesListContext = createContext<PosSalesListContextValue | null>(null);

export function usePosSalesList() {
  const context = useContext(PosSalesListContext);
  if (!context) throw new Error("usePosSalesList must be used within PosSalesListProvider");
  return context;
}

type PosSalesListProviderProps = {
  children: React.ReactNode;
};

export function PosSalesListProvider({ children }: PosSalesListProviderProps) {
  const { from, to } = usePosSalesRange();

  const [page, setPage] = useState(1);

  const state = useListInvoices({ channel: InvoiceChannel.POS, page, limit: PAGE_SIZE, from, to });

  const invoices = state.invoices ?? [];
  const meta = state.meta ?? null;
  const error = state.error;

  return (
    <PosSalesListContext.Provider
      value={{
        invoices,
        meta,
        loading: state.loading,
        error,
        page,
        setPage,
      }}
    >
      {children}
    </PosSalesListContext.Provider>
  );
}