"use client";

import { createContext, useContext } from "react";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { InvoiceChannel } from "@/features/invoice/domain/enums/invoice-channel";
import { PayInStatus } from "@/features/invoice/domain/enums/pay-in-status";
import { useGetInvoice } from "@/features/invoice/presentations/hooks/use-get-invoice";

const PENDING_POLL_INTERVAL_MS = 5000;

type PosReceiptContextValue = {
  invoice: OutgoingInvoiceEntity;
};

const PosReceiptContext = createContext<PosReceiptContextValue | null>(null);

export function usePosReceipt(): PosReceiptContextValue {
  const ctx = useContext(PosReceiptContext);
  if (!ctx) throw new Error("usePosReceipt must be used within a PosReceiptProvider");
  return ctx;
}

type PosReceiptProviderProps = {
  id: string;
  loading: React.ReactNode;
  error: (error: ServerError) => React.ReactNode;
  children: React.ReactNode;
};

export function PosReceiptProvider({ id, loading, error, children }: PosReceiptProviderProps) {
  const state = useGetInvoice(
    { id },
    {
      refreshInterval: (latest) =>
        latest instanceof OutgoingInvoiceEntity &&
        latest.payInDetail?.detail?.status === PayInStatus.PENDING_PAYMENT
          ? PENDING_POLL_INTERVAL_MS
          : 0,
    },
  );

  if (state.loading) return <>{loading}</>;
  if (state.error) return <>{error(state.error)}</>;
  if (!(state.invoice instanceof OutgoingInvoiceEntity)) {
    return <>{error(new ServerError(ErrorCodes.NOT_FOUND))}</>;
  }
  // Channel guard: GET /invoices/:id is shared with B2B; render not-found if the
  // id resolves to a non-POS invoice rather than letting the receipt UI render
  // a half-broken B2B invoice.
  if (state.invoice.channel !== InvoiceChannel.POS) return <>{error(new ServerError(ErrorCodes.NOT_FOUND))}</>;

  return <PosReceiptContext.Provider value={{ invoice: state.invoice }}>{children}</PosReceiptContext.Provider>;
}
