"use client";

import { createContext, useContext } from "react";
import { ProductionRecordEntity } from "@/features/production/domain/entities/production-record";
import { useGetProductionRecord } from "@/features/production/presentations/hooks/use-get-production-record";

type ProductionDetailContextValue = {
  record: ProductionRecordEntity;
};

const ProductionDetailContext = createContext<ProductionDetailContextValue | null>(null);

export function useProductionDetail() {
  const context = useContext(ProductionDetailContext);
  if (!context) throw new Error("useProductionDetail must be used within ProductionDetailProvider");
  return context;
}

type ProductionDetailProviderProps = {
  id: string;
  loading: React.ReactNode;
  children: React.ReactNode;
};

export function ProductionDetailProvider({ id, loading: loadingIndicator, children }: ProductionDetailProviderProps) {
  const { record, loading } = useGetProductionRecord(id);

  if (loading || !record) return <>{loadingIndicator}</>;

  return (
    <ProductionDetailContext.Provider value={{ record }}>
      {children}
    </ProductionDetailContext.Provider>
  );
}
