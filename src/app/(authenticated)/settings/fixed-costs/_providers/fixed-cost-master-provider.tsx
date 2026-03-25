"use client";

import { createContext, useContext, useState } from "react";
import { useDebounce } from "@/core/presentations/hooks/use-debounce";
import { PaginationMeta } from "@/core/resources/paginated";
import { FixedCostEntity } from "@/features/fixed-cost/domain/entities/fixed-cost";
import { useListFixedCosts } from "@/features/fixed-cost/presentations/hooks/use-list-fixed-costs";

type FixedCostMasterContextValue = {
  fixedCosts: FixedCostEntity[];
  meta: PaginationMeta | null;
  loading: boolean;
  search: string;
  page: number;
  editingItem: FixedCostEntity | null;
  deletingItem: FixedCostEntity | null;
  setSearch: (value: string) => void;
  setPage: (page: number) => void;
  setEditingItem: (item: FixedCostEntity | null) => void;
  setDeletingItem: (item: FixedCostEntity | null) => void;
};

const FixedCostMasterContext = createContext<FixedCostMasterContextValue | null>(null);

export function useFixedCostMaster() {
  const context = useContext(FixedCostMasterContext);
  if (!context) throw new Error("useFixedCostMaster must be used within FixedCostMasterProvider");
  return context;
}

type FixedCostMasterProviderProps = {
  children: React.ReactNode;
};

export function FixedCostMasterProvider({ children }: FixedCostMasterProviderProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [editingItem, setEditingItem] = useState<FixedCostEntity | null>(null);
  const [deletingItem, setDeletingItem] = useState<FixedCostEntity | null>(null);

  const debouncedSearch = useDebounce(search.trim(), 500);
  const searchQuery = debouncedSearch.length >= 2 ? debouncedSearch : undefined;

  const { fixedCosts, meta, loading } = useListFixedCosts({ page, limit: 10, search: searchQuery });

  return (
    <FixedCostMasterContext.Provider
      value={{
        fixedCosts,
        meta,
        loading,
        search,
        page,
        editingItem,
        deletingItem,
        setSearch,
        setPage,
        setEditingItem,
        setDeletingItem,
      }}
    >
      {children}
    </FixedCostMasterContext.Provider>
  );
}
