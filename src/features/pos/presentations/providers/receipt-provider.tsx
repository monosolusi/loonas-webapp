"use client";

import { createContext, useContext } from "react";
import { ServerError } from "@/core/resources/server-error";
import { PosSaleEntity } from "@/features/pos/domain/entities/pos-sale";
import { useGetPosSale } from "@/features/pos/presentations/hooks/use-get-pos-sale";

type ReceiptContextValue = {
  sale: PosSaleEntity;
};

const ReceiptContext = createContext<ReceiptContextValue | null>(null);

export function useReceipt(): ReceiptContextValue {
  const ctx = useContext(ReceiptContext);
  if (!ctx) throw new Error("useReceipt must be used within a ReceiptProvider");
  return ctx;
}

type ReceiptProviderProps = {
  id: string;
  loading: React.ReactNode;
  error: (error: ServerError) => React.ReactNode;
  children: React.ReactNode;
};

export function ReceiptProvider({ id, loading, error, children }: ReceiptProviderProps) {
  const state = useGetPosSale(id);

  if (state.status === "loading") return <>{loading}</>;
  if (state.status === "error") return <>{error(state.error)}</>;

  return <ReceiptContext.Provider value={{ sale: state.sale }}>{children}</ReceiptContext.Provider>;
}
