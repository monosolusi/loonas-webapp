// Canonical example: Pattern B — page-level list provider with filter state,
// debounced search, and shared deleting-item dialog state.
// Source: src/app/(authenticated)/productions/_providers/production-list-provider.tsx

"use client";

import { createContext, useContext, useState } from "react";
import { DateTime } from "luxon";
import { PaginationMeta } from "@/core/resources/paginated";
import { useDebounce } from "@/core/presentations/hooks/use-debounce";
import { ProductionRecordEntity } from "@/features/production/domain/entities/production-record";
import { useListProductionRecords } from "@/features/production/presentations/hooks/use-list-production-records";

type ProductionListContextValue = {
  records: ProductionRecordEntity[];
  meta: PaginationMeta | null;
  loading: boolean;
  page: number;
  search: string;
  dateFrom: DateTime | undefined;
  dateTo: DateTime | undefined;
  deletingItem: ProductionRecordEntity | null;
  setPage: (page: number) => void;
  setSearch: (value: string) => void;
  setDateFrom: (value: DateTime | undefined) => void;
  setDateTo: (value: DateTime | undefined) => void;
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
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState<DateTime | undefined>(undefined);
  const [dateTo, setDateTo] = useState<DateTime | undefined>(undefined);
  const [deletingItem, setDeletingItem] = useState<ProductionRecordEntity | null>(null);

  // Debounce + 2-char minimum — avoid firing API calls on every keystroke.
  const debouncedSearch = useDebounce(search.trim(), 500);
  const searchQuery = debouncedSearch.length >= 2 ? debouncedSearch : undefined;

  const result = useListProductionRecords({
    search: searchQuery,
    dateFrom: dateFrom?.toISODate() ?? undefined,
    dateTo: dateTo?.toISODate() ?? undefined,
    page,
    limit: 10,
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
        dateFrom,
        dateTo,
        deletingItem,
        setPage,
        setSearch,
        setDateFrom,
        setDateTo,
        setDeletingItem,
      }}
    >
      {children}
    </ProductionListContext.Provider>
  );
}
