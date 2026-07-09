"use client";

import { createContext, useContext, useState } from "react";
import { PaginationMeta } from "@/core/resources/paginated";
import { useDebounce } from "@/core/presentations/hooks/use-debounce";
import { ProductionRecordEntity } from "@/features/production/domain/entities/production-record";
import { useListProductionRecords } from "@/features/production/presentations/hooks/use-list-production-records";
import { useProductionRange } from "@/app/(authenticated)/productions/_providers/production-range-provider";
import { DEFAULT_PAGE_SIZE } from "@/core/utilities/pagination";

type ProductionListContextValue = {
  records: ProductionRecordEntity[];
  meta: PaginationMeta | null;
  loading: boolean;
  page: number;
  search: string;
  dateFrom: string;
  dateTo: string;
  deletingItem: ProductionRecordEntity | null;
  setPage: (page: number) => void;
  setSearch: (value: string) => void;
  setDeletingItem: (item: ProductionRecordEntity | null) => void;
};

const ProductionListContext = createContext<ProductionListContextValue | null>(null);

export function useProductionList() {
  const context = useContext(ProductionListContext);
  if (!context) throw new Error("useProductionList must be used within ProductionListProvider");
  return context;
}

type ProductionListProviderProps = {
  children: React.ReactNode;
};

export function ProductionListProvider({ children }: ProductionListProviderProps) {
  const { from, to } = useProductionRange();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [deletingItem, setDeletingItem] = useState<ProductionRecordEntity | null>(null);

  const debouncedSearch = useDebounce(search.trim(), 500);
  const searchQuery = debouncedSearch.length >= 2 ? debouncedSearch : undefined;

  const result = useListProductionRecords({
    search: searchQuery,
    dateFrom: from,
    dateTo: to,
    page,
    limit: DEFAULT_PAGE_SIZE,
  });

  const records = result.records ?? [];
  const meta = result.meta ?? null;

  return (
    <ProductionListContext.Provider
      value={{
        records,
        meta,
        loading: result.loading,
        page,
        search,
        dateFrom: from,
        dateTo: to,
        deletingItem,
        setPage,
        setSearch,
        setDeletingItem,
      }}
    >
      {children}
    </ProductionListContext.Provider>
  );
}
