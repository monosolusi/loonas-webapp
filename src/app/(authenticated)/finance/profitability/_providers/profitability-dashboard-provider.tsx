"use client";

import { createContext, useContext, useState } from "react";
import { useListProducts } from "@/features/product/presentations/hooks/use-list-products";
import { ProductEntity } from "@/features/product/domain/entities/product";

type ProductsMeta = { page: number; limit: number; total: number; totalPages: number };

type ProfitabilityDashboardContextValue = {
  products: ProductEntity[];
  meta: ProductsMeta | null;
  loading: boolean;
  error: boolean;
  page: number;
  search: string;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  onRetry: () => void;
};

const ProfitabilityDashboardContext = createContext<ProfitabilityDashboardContextValue | null>(null);

export function useProfitabilityDashboard() {
  const context = useContext(ProfitabilityDashboardContext);
  if (!context) throw new Error("useProfitabilityDashboard must be used within ProfitabilityDashboardProvider");
  return context;
}

type ProfitabilityDashboardProviderProps = {
  children: React.ReactNode;
};

export function ProfitabilityDashboardProvider({ children }: ProfitabilityDashboardProviderProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { products, meta, loading, error } = useListProducts({ page, limit: 20, search: search || undefined });

  function handleRetry() {
    setPage(1);
  }

  function handleSetSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  return (
    <ProfitabilityDashboardContext.Provider
      value={{
        products,
        meta,
        loading,
        error: error !== null,
        page,
        search,
        setPage,
        setSearch: handleSetSearch,
        onRetry: handleRetry,
      }}
    >
      {children}
    </ProfitabilityDashboardContext.Provider>
  );
}
