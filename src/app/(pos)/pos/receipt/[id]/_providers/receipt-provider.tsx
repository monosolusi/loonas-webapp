"use client";

import { createContext, useContext } from "react";
import { PosSaleEntity } from "@/features/pos/domain/entities/pos-sale";
import { useGetPosSale } from "@/features/pos/presentations/hooks/use-get-pos-sale";
import { ReceiptError } from "@/app/(pos)/pos/receipt/[id]/_components/receipt-error";

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
  children: React.ReactNode;
};

export function ReceiptProvider({ id, loading, children }: ReceiptProviderProps) {
  const state = useGetPosSale(id);

  if (state.status === "loading") return <>{loading}</>;
  if (state.status === "error") return <ReceiptError error={state.error} />;

  return <ReceiptContext.Provider value={{ sale: state.sale }}>{children}</ReceiptContext.Provider>;
}
