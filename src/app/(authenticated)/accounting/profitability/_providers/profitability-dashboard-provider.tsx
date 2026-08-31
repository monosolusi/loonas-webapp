"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useListProducts } from "@/features/product/presentations/hooks/use-list-products";
import { ProductEntity } from "@/features/product/domain/entities/product";
import { DEFAULT_PAGE_SIZE } from "@/core/utilities/pagination";
import { UseGetVariantGrossProfitReturnType } from "@/features/profitability/presentations/hooks/use-get-variant-gross-profit.types";

type ProductsMeta = { page: number; limit: number; total: number; totalPages: number };

type VariantGrossProfitState = UseGetVariantGrossProfitReturnType;

type ProfitabilityDashboardContextValue = {
  products: ProductEntity[];
  meta: ProductsMeta | null;
  loading: boolean;
  error: boolean;
  page: number;
  search: string;
  totalVariants: number;
  profitableCount: number;
  atRiskCount: number;
  summaryLoading: boolean;
  registerVariantGrossProfitState: (
    key: string,
    state: VariantGrossProfitState,
  ) => void;
  unregisterVariantGrossProfitState: (key: string) => void;
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

function makeVariantKey(productId: string, variantId: string) {
  return `${productId}::${variantId}`;
}

export function ProfitabilityDashboardProvider({ children }: ProfitabilityDashboardProviderProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [grossProfitStates, setGrossProfitStates] = useState<Record<string, VariantGrossProfitState>>({});

  const { products, meta, loading, error, refresh } = useListProducts({ page, limit: DEFAULT_PAGE_SIZE, search: search || undefined });

  const totalVariants = useMemo(() => {
    return products.reduce((sum, product) => sum + product.variants.length, 0);
  }, [products]);

  const registerVariantGrossProfitState = useCallback(
    (key: string, state: VariantGrossProfitState) => {
      setGrossProfitStates((prev) => {
        if (prev[key] === state) return prev;
        return { ...prev, [key]: state };
      });
    },
    [],
  );

  const unregisterVariantGrossProfitState = useCallback((key: string) => {
    setGrossProfitStates((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }, []);

  const summaryMetrics = useMemo(() => {
    let profitable = 0;
    let atRisk = 0;

    for (const state of Object.values(grossProfitStates)) {
      if (state.loading || state.error || state.isIncompleteRecipe || !state.data) continue;
      const grossProfit = state.data;
      if (grossProfit.needsData || grossProfit.estimatedGrossProfit === null) continue;

      if (grossProfit.estimatedGrossProfit >= 0) {
        profitable += 1;
      } else {
        atRisk += 1;
      }
    }

    return { profitableCount: profitable, atRiskCount: atRisk };
  }, [grossProfitStates]);

  const expectedKeys = useMemo(() => {
    const keys = new Set<string>();
    for (const product of products) {
      for (const variant of product.variants) {
        keys.add(makeVariantKey(product.id, variant.id));
      }
    }
    return keys;
  }, [products]);

  const summaryLoading = useMemo(() => {
    if (loading) return true;

    const registeredKeys = Object.keys(grossProfitStates);
    if (registeredKeys.length === 0 && totalVariants > 0) return true;

    for (const key of expectedKeys) {
      const state = grossProfitStates[key];
      if (!state || state.loading) return true;
    }

    return false;
  }, [loading, grossProfitStates, expectedKeys, totalVariants]);

  function handleRetry() {
    void refresh().catch(() => {});
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
        totalVariants,
        profitableCount: summaryMetrics.profitableCount,
        atRiskCount: summaryMetrics.atRiskCount,
        summaryLoading,
        registerVariantGrossProfitState,
        unregisterVariantGrossProfitState,
        setPage,
        setSearch: handleSetSearch,
        onRetry: handleRetry,
      }}
    >
      {children}
    </ProfitabilityDashboardContext.Provider>
  );
}
