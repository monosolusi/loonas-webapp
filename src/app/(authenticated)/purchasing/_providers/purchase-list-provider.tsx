"use client";

import { createContext, useContext, useState } from "react";
import { PaginationMeta } from "@/core/resources/paginated";
import { useDebounce } from "@/core/presentations/hooks/use-debounce";
import { PurchaseEntity } from "@/features/purchasing/domain/entities/purchase";
import { useListPurchases } from "@/features/purchasing/presentations/hooks/use-list-purchases";
import { usePurchaseRange } from "@/app/(authenticated)/purchasing/_providers/purchase-range-provider";

type PurchaseListContextValue = {
  purchases: PurchaseEntity[];
  meta: PaginationMeta | null;
  loading: boolean;
  page: number;
  search: string;
  deletingItem: PurchaseEntity | null;
  setPage: (page: number) => void;
  setSearch: (value: string) => void;
  setDeletingItem: (item: PurchaseEntity | null) => void;
};

const PurchaseListContext = createContext<PurchaseListContextValue | null>(null);

export function usePurchaseList() {
  const context = useContext(PurchaseListContext);
  if (!context) throw new Error("usePurchaseList must be used within PurchaseListProvider");
  return context;
}

type PurchaseListProviderProps = {
  children: React.ReactNode;
};

export function PurchaseListProvider({ children }: PurchaseListProviderProps) {
  const { from, to } = usePurchaseRange();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deletingItem, setDeletingItem] = useState<PurchaseEntity | null>(null);

  const debouncedSearch = useDebounce(search.trim(), 500);
  const searchQuery = debouncedSearch.length >= 2 ? debouncedSearch : undefined;

  const result = useListPurchases({
    search: searchQuery,
    dateFrom: from,
    dateTo: to,
    page,
    limit: 10,
  });

  const purchases = result.purchases ?? [];
  const meta = result.meta ?? null;

  return (
    <PurchaseListContext.Provider
      value={{
        purchases,
        meta,
        loading: result.loading,
        page,
        search,
        deletingItem,
        setPage,
        setSearch,
        setDeletingItem,
      }}
    >
      {children}
    </PurchaseListContext.Provider>
  );
}
