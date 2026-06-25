"use client";

import { createContext, useContext } from "react";

type ProfitabilityDetailContextValue = {
  productId: string;
  variantId: string;
};

const ProfitabilityDetailContext = createContext<ProfitabilityDetailContextValue | null>(null);

export function useProfitabilityDetail() {
  const context = useContext(ProfitabilityDetailContext);
  if (!context) throw new Error("useProfitabilityDetail must be used within ProfitabilityDetailProvider");
  return context;
}

type ProfitabilityDetailProviderProps = {
  productId: string;
  variantId: string;
  children: React.ReactNode;
};

export function ProfitabilityDetailProvider({ productId, variantId, children }: ProfitabilityDetailProviderProps) {
  return (
    <ProfitabilityDetailContext.Provider value={{ productId, variantId }}>
      {children}
    </ProfitabilityDetailContext.Provider>
  );
}
