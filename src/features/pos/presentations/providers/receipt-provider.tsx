"use client";

import { createContext, useContext } from "react";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { PosSaleEntity } from "@/features/pos/domain/entities/pos-sale";
import { PayInDetailStatus } from "@/features/pos/domain/enums/pay-in-detail-status";
import { useGetPosSale } from "@/features/pos/presentations/hooks/use-get-pos-sale";

const PENDING_POLL_INTERVAL_MS = 5000;

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
  const state = useGetPosSale(id, {
    refreshInterval: (latest) =>
      latest?.payInDetail?.status === PayInDetailStatus.PENDING_PAYMENT ? PENDING_POLL_INTERVAL_MS : 0,
  });

  if (state.status === "loading") return <>{loading}</>;
  if (state.status === "error") return <>{error(state.error)}</>;
  // Channel guard: GET /invoices/:id is shared with B2B; render not-found if the
  // id resolves to a non-POS invoice rather than letting the receipt UI render
  // a half-broken B2B invoice.
  if (state.sale.channel !== "pos") return <>{error(new ServerError(ErrorCodes.NOT_FOUND))}</>;

  return <ReceiptContext.Provider value={{ sale: state.sale }}>{children}</ReceiptContext.Provider>;
}
