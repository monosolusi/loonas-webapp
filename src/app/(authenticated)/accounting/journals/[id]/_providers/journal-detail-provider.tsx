"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { ServerError } from "@/core/resources/server-error";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { WarningEntryEntity } from "@/features/accounting/domain/entities/warning-entry";
import { JournalEntity } from "@/features/accounting/domain/entities/journal";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { useGetJournal } from "@/features/accounting/presentations/hooks/use-get-journal";
import { useReverseJournal } from "@/features/accounting/presentations/hooks/use-reverse-journal";
import { JournalDetailError } from "@/app/(authenticated)/accounting/journals/[id]/_components/journal-detail-error";

type JournalDetailContextValue = {
  journal: JournalEntity;
  isReversing: boolean;
  reverseDialogOpen: boolean;
  pendingWarnings: WarningEntryEntity[];
  reverseFormError: string | null;
  handleOpenReverseDialog: () => void;
  closeReverseDialog: () => void;
  handleSubmitReverse: (category: string, detail: string) => Promise<boolean>;
  handleConfirmWarnings: () => Promise<void>;
};

const JournalDetailContext = createContext<JournalDetailContextValue | null>(null);

export function useJournalDetail() {
  const context = useContext(JournalDetailContext);
  if (!context) throw new Error("useJournalDetail must be used within JournalDetailProvider");
  return context;
}

type JournalDetailProviderProps = {
  id: string;
  loading: React.ReactNode;
  children: React.ReactNode;
};

export function JournalDetailProvider({ id, loading, children }: JournalDetailProviderProps) {
  const { showToast } = useToast();
  const journalState = useGetJournal(id);
  const { trigger, isMutating } = useReverseJournal();

  const [reverseDialogOpen, setReverseDialogOpen] = useState(false);
  const [pendingWarnings, setPendingWarnings] = useState<WarningEntryEntity[]>([]);
  const [acknowledgedCodes, setAcknowledgedCodes] = useState<string[]>([]);
  const [reverseFormError, setReverseFormError] = useState<string | null>(null);

  // category + detail captured on first submit; reused on ack resubmit (same focus trap)
  const pendingCategoryRef = useRef<string>("");
  const pendingDetailRef = useRef<string>("");

  // One UUID per reverse attempt. Rotated only on terminal error.
  const idempotencyKeyRef = useRef(crypto.randomUUID());

  const isReversing = isMutating;

  const mapServerError = useCallback(
    (err: ServerError) => {
      const code = err.code === "UNKNOWN" ? (err.details?.code ?? err.code) : err.code;

      if (code === "PERIOD_CLOSED") {
        setReverseFormError("Periode untuk tanggal ini sudah ditutup.");
        return;
      }

      // Other 422 business codes — use server message
      if (err.httpCode === 422) {
        setReverseFormError(err.message);
        return;
      }

      // Network / 5xx / unknown → toast, preserve form
      showToast("Gagal membalik jurnal. Silakan coba lagi.", "error");
    },
    [showToast],
  );

  const doTrigger = useCallback(
    async (category: string, detail: string, ackCodes: string[]) => {
      return trigger({
        id,
        changeReasonCategory: category,
        changeReasonDetail: detail,
        acknowledgedWarningCodes: ackCodes,
        idempotencyKey: idempotencyKeyRef.current,
      });
    },
    [id, trigger],
  );

  const handleOpenReverseDialog = useCallback(() => {
    // Reset state for new attempt
    setReverseFormError(null);
    setAcknowledgedCodes([]);
    setPendingWarnings([]);
    idempotencyKeyRef.current = crypto.randomUUID();
    pendingCategoryRef.current = "";
    pendingDetailRef.current = "";
    setReverseDialogOpen(true);
  }, []);

  const closeReverseDialog = useCallback(() => {
    if (isReversing) return;
    setReverseDialogOpen(false);
    setReverseFormError(null);
    setPendingWarnings([]);
  }, [isReversing]);

  const handleSubmitReverse = useCallback(
    async (category: string, detail: string): Promise<boolean> => {
      setReverseFormError(null);
      pendingCategoryRef.current = category;
      pendingDetailRef.current = detail;

      try {
        const result = await doTrigger(category, detail, acknowledgedCodes);
        if (!result) return false;

        if (result.kind === "needs-acknowledge") {
          // Switch dialog to ack mode — same focus trap stays open
          setPendingWarnings(result.warnings);
          return false;
        }

        // success
        setReverseDialogOpen(false);
        showToast("Jurnal berhasil dibalik.", "success");
        await revalidateSWRKey(ACCOUNTING_SWR_KEYS.GET_JOURNAL, ACCOUNTING_SWR_KEYS.LIST_JOURNALS);
        return true;
      } catch (err) {
        // Rotate key on terminal error
        idempotencyKeyRef.current = crypto.randomUUID();
        if (err instanceof ServerError) {
          mapServerError(err);
        } else {
          showToast("Gagal membalik jurnal. Silakan coba lagi.", "error");
        }
        return false;
      }
    },
    [acknowledgedCodes, doTrigger, mapServerError, showToast],
  );

  const handleConfirmWarnings = useCallback(async () => {
    // Merge pending warning codes into acknowledged set. KEEP SAME idempotency key.
    const newAckCodes = [...acknowledgedCodes, ...pendingWarnings.map((w) => w.code)];
    setAcknowledgedCodes(newAckCodes);

    const category = pendingCategoryRef.current;
    const detail = pendingDetailRef.current;

    try {
      const result = await doTrigger(category, detail, newAckCodes);
      if (!result) return;

      if (result.kind === "needs-acknowledge") {
        // Second wave of warnings — stay in ack mode, update list
        setPendingWarnings(result.warnings);
        return;
      }

      // success
      setPendingWarnings([]);
      setReverseDialogOpen(false);
      showToast("Jurnal berhasil dibalik.", "success");
      await revalidateSWRKey(ACCOUNTING_SWR_KEYS.GET_JOURNAL, ACCOUNTING_SWR_KEYS.LIST_JOURNALS);
    } catch (err) {
      // Rotate key on terminal error during ack-path
      idempotencyKeyRef.current = crypto.randomUUID();
      setPendingWarnings([]);
      if (err instanceof ServerError) {
        mapServerError(err);
      } else {
        showToast("Gagal membalik jurnal. Silakan coba lagi.", "error");
      }
    }
  }, [acknowledgedCodes, pendingWarnings, doTrigger, mapServerError, showToast]);

  if (journalState.loading) return <>{loading}</>;
  if (journalState.error) return <JournalDetailError onRetry={() => journalState.refresh?.()} />;

  return (
    <JournalDetailContext.Provider
      value={{
        journal: journalState.data,
        isReversing,
        reverseDialogOpen,
        pendingWarnings,
        reverseFormError,
        handleOpenReverseDialog,
        closeReverseDialog,
        handleSubmitReverse,
        handleConfirmWarnings,
      }}
    >
      {children}
    </JournalDetailContext.Provider>
  );
}
