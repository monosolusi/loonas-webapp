"use client";

import { createContext, useContext } from "react";
import { PurchaseEntity } from "@/features/purchasing/domain/entities/purchase";
import { useGetPurchase } from "@/features/purchasing/presentations/hooks/use-get-purchase";

type PurchaseDetailContextValue = {
  purchase: PurchaseEntity;
};

const PurchaseDetailContext = createContext<PurchaseDetailContextValue | null>(null);

export function usePurchaseDetail() {
  const context = useContext(PurchaseDetailContext);
  if (!context) throw new Error("usePurchaseDetail must be used within PurchaseDetailProvider");
  return context;
}

type PurchaseDetailProviderProps = {
  id: string;
  loading: React.ReactNode;
  children: React.ReactNode;
};

export function PurchaseDetailProvider({ id, loading: loadingIndicator, children }: PurchaseDetailProviderProps) {
  const { purchase, loading } = useGetPurchase(id);

  if (loading || !purchase) return <>{loadingIndicator}</>;

  return (
    <PurchaseDetailContext.Provider value={{ purchase }}>
      {children}
    </PurchaseDetailContext.Provider>
  );
}
