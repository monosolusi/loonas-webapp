"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { ErrorCodes, ServerError } from "@/core/resources/server-error";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { shouldRotateIdempotencyKey } from "@/core/helpers/idempotency-rotation";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { CashEntryEntity } from "@/features/accounting/domain/entities/cash-entry";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { useGetCashEntry } from "@/features/accounting/presentations/hooks/use-get-cash-entry";
import { useCancelCashEntry } from "@/features/accounting/presentations/hooks/use-cancel-cash-entry";
import { classifyCancelError } from "@/app/(authenticated)/accounting/cash-entries/[id]/_utils/classify-cancel-error";
import { CashEntryDetailError } from "@/app/(authenticated)/accounting/cash-entries/[id]/_components/cash-entry-detail-error";

type CashEntryDetailContextValue = {
  entry: CashEntryEntity;
  isCancelling: boolean;
  cancelDialogOpen: boolean;
  cancelFormError: string | null;
  openCancelDialog: () => void;
  closeCancelDialog: () => void;
  submitCancel: (note: string) => Promise<boolean>;
};

const CashEntryDetailContext = createContext<CashEntryDetailContextValue | null>(null);

export function useCashEntryDetail() {
  const context = useContext(CashEntryDetailContext);
  if (!context) throw new Error("useCashEntryDetail must be used within CashEntryDetailProvider");
  return context;
}

type CashEntryDetailProviderProps = {
  id: string;
  loading: React.ReactNode;
  children: React.ReactNode;
};

export function CashEntryDetailProvider({ id, loading, children }: CashEntryDetailProviderProps) {
  const { showToast } = useToast();
  const entryState = useGetCashEntry(id);
  const { trigger, isMutating } = useCancelCashEntry();

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [cancelFormError, setCancelFormError] = useState<string | null>(null);

  // One UUID per cancel attempt, rotated only on a definitive 4xx (shouldRotateIdempotencyKey).
  const idempotencyKeyRef = useRef(crypto.randomUUID());

  const isCancelling = isMutating;

  const openCancelDialog = useCallback(() => {
    setCancelFormError(null);
    idempotencyKeyRef.current = crypto.randomUUID();
    setCancelDialogOpen(true);
  }, []);

  const closeCancelDialog = useCallback(() => {
    if (isCancelling) return;
    setCancelDialogOpen(false);
    setCancelFormError(null);
  }, [isCancelling]);

  const submitCancel = useCallback(
    async (note: string): Promise<boolean> => {
      setCancelFormError(null);
      const trimmedNote = note.trim();

      try {
        await trigger({
          id,
          idempotencyKey: idempotencyKeyRef.current,
          note: trimmedNote === "" ? null : trimmedNote,
        });

        setCancelDialogOpen(false);
        showToast("Entri kas berhasil dibatalkan.", "success");
        // The trigger returns the CANCELLATION entry, not the original — refetch the original
        // so it re-renders with status "cancelled" and its new cross-reference.
        await entryState.refresh?.();
        await revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_CASH_ENTRIES);
        return true;
      } catch (err) {
        if (!(err instanceof ServerError)) {
          showToast("Gagal membatalkan entri kas. Silakan coba lagi.", "error");
          return false;
        }

        // classifyCancelError owns the registry-fallback unwrap (UNKNOWN → details.code) — read
        // its `code` instead of re-deriving it here.
        const classified = classifyCancelError(err);

        const httpStatus = (err.details?.["status"] as number | undefined) ?? null;
        if (shouldRotateIdempotencyKey(httpStatus, classified.code)) {
          idempotencyKeyRef.current = crypto.randomUUID();
        }

        if (classified.placement === "inline") {
          setCancelFormError(classified.message);
        } else {
          showToast(classified.message, "error");
        }

        // The entry was already cancelled by someone else — refetch so the header's cancel
        // affordance disappears rather than staying available on a now-stale render.
        if (classified.code === ErrorCodes.CASH_ENTRY_ALREADY_CANCELLED.code) {
          try {
            await entryState.refresh?.();
          } catch {
            // Best-effort — the inline message already explains the state.
          }
        }

        return false;
      }
    },
    [entryState, id, showToast, trigger],
  );

  if (entryState.loading) return <>{loading}</>;
  if (entryState.error) return <CashEntryDetailError error={entryState.error} onRetry={() => entryState.refresh?.()} />;

  return (
    <CashEntryDetailContext.Provider
      value={{
        entry: entryState.data,
        isCancelling,
        cancelDialogOpen,
        cancelFormError,
        openCancelDialog,
        closeCancelDialog,
        submitCancel,
      }}
    >
      {children}
    </CashEntryDetailContext.Provider>
  );
}
