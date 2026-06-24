"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DateTime } from "luxon";
import { ServerError } from "@/core/resources/server-error";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { WarningEntryEntity } from "@/features/accounting/domain/entities/warning-entry";
import { JournalLineDraft } from "@/features/accounting/presentations/components/journal-line-editor/journal-line-editor.types";
import { computeJournalLineBalance } from "@/features/accounting/presentations/helpers/compute-journal-line-balance";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { useCreateJournal } from "@/features/accounting/presentations/hooks/use-create-journal";

type FieldErrors = {
  date?: string;
  memo?: string;
};

type JournalCreateContextValue = {
  postingDate: DateTime | undefined;
  memo: string;
  lines: JournalLineDraft[];
  warningDialogOpen: boolean;
  pendingWarnings: WarningEntryEntity[];
  formError: string | null;
  fieldErrors: FieldErrors;
  isSubmitting: boolean;
  enabled: boolean;
  setPostingDate: (date: DateTime | undefined) => void;
  setMemo: (memo: string) => void;
  setLines: (lines: JournalLineDraft[]) => void;
  handleSubmit: () => Promise<void>;
  handleConfirmWarnings: () => Promise<void>;
  closeWarningDialog: () => void;
};

const JournalCreateContext = createContext<JournalCreateContextValue | null>(null);

export function useJournalCreate() {
  const context = useContext(JournalCreateContext);
  if (!context) throw new Error("useJournalCreate must be used within JournalCreateProvider");
  return context;
}

type JournalCreateProviderProps = {
  children: React.ReactNode;
};

function makeBlankLine(): JournalLineDraft {
  return { account_id: null, debit: 0, credit: 0 };
}

export function JournalCreateProvider({ children }: JournalCreateProviderProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const { trigger, isMutating } = useCreateJournal();

  const [postingDate, setPostingDate] = useState<DateTime | undefined>(DateTime.now().startOf("day"));
  const [memo, setMemo] = useState("");
  const [lines, setLines] = useState<JournalLineDraft[]>([makeBlankLine(), makeBlankLine()]);
  const [warningDialogOpen, setWarningDialogOpen] = useState(false);
  const [pendingWarnings, setPendingWarnings] = useState<WarningEntryEntity[]>([]);
  const [acknowledgedCodes, setAcknowledgedCodes] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  // One UUID per form session. Rotated only on a terminal error (non-ack path).
  const idempotencyKeyRef = useRef(crypto.randomUUID());

  const balance = useMemo(() => computeJournalLineBalance(lines), [lines]);

  const isSubmitting = isMutating;

  const enabled = useMemo(
    () => balance.isBalanced && balance.totalDebit > 0 && !!postingDate && !isSubmitting,
    [balance.isBalanced, balance.totalDebit, postingDate, isSubmitting],
  );

  const handleClearErrors = useCallback(() => {
    setFormError(null);
    setFieldErrors({});
  }, []);

  const mapServerError = useCallback((err: ServerError) => {
    const code = err.code === "UNKNOWN" ? (err.details?.code ?? err.code) : err.code;
    const message = err.message;

    // Closed-period
    if (code === "PERIOD_CLOSED") {
      setFieldErrors((prev) => ({ ...prev, date: "Periode untuk tanggal ini sudah ditutup." }));
      return;
    }

    // Memo length
    if (message.toLowerCase().includes("memo") && message.toLowerCase().includes("panjang")) {
      setFieldErrors((prev) => ({ ...prev, memo: "Memo terlalu panjang." }));
      return;
    }

    // Other 422 business codes — use server message
    if (err.httpCode === 422) {
      setFormError(message);
      return;
    }

    // Network / 5xx / unknown → toast, preserve form
    showToast("Gagal menyimpan jurnal. Silakan coba lagi.", "error");
  }, [showToast]);

  const doTrigger = useCallback(
    async (ackCodes: string[]) => {
      if (!postingDate) return;

      return trigger({
        postingDate: postingDate.toISO() ?? postingDate.toISODate() ?? "",
        memo,
        lines: lines
          .filter((l) => l.account_id !== null)
          .map((l) => ({ accountId: l.account_id as string, debit: l.debit, credit: l.credit })),
        acknowledgedWarningCodes: ackCodes,
        idempotencyKey: idempotencyKeyRef.current,
      });
    },
    [postingDate, memo, lines, trigger],
  );

  const handleSubmit = useCallback(async () => {
    // Completeness check — every line must have a non-null account_id
    const hasIncompleteLines = lines.some((l) => l.account_id === null);
    if (hasIncompleteLines) {
      setFormError("Lengkapi akun pada setiap baris.");
      return;
    }

    handleClearErrors();

    try {
      const result = await doTrigger(acknowledgedCodes);
      if (!result) return;

      if (result.kind === "needs-acknowledge") {
        setPendingWarnings(result.warnings);
        setWarningDialogOpen(true);
        return;
      }

      // success
      showToast("Jurnal berhasil diposting.", "success");
      await revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_JOURNALS);
      router.push("/finance/journals");
    } catch (err) {
      // Rotate key on terminal error so the next fresh first-phase submit uses a new key
      idempotencyKeyRef.current = crypto.randomUUID();
      if (err instanceof ServerError) {
        mapServerError(err);
      } else {
        showToast("Gagal menyimpan jurnal. Silakan coba lagi.", "error");
      }
    }
  }, [lines, acknowledgedCodes, doTrigger, handleClearErrors, mapServerError, showToast, router]);

  const handleConfirmWarnings = useCallback(async () => {
    // Merge pending warning codes into acknowledged set. KEEP SAME idempotency key.
    const newAckCodes = [...acknowledgedCodes, ...pendingWarnings.map((w) => w.code)];
    setAcknowledgedCodes(newAckCodes);

    try {
      const result = await doTrigger(newAckCodes);
      if (!result) return;

      if (result.kind === "needs-acknowledge") {
        // Second wave of warnings — keep dialog open
        setPendingWarnings(result.warnings);
        return;
      }

      // success
      setWarningDialogOpen(false);
      setPendingWarnings([]);
      showToast("Jurnal berhasil diposting.", "success");
      await revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_JOURNALS);
      router.push("/finance/journals");
    } catch (err) {
      // Rotate key on terminal error during ack-path
      idempotencyKeyRef.current = crypto.randomUUID();
      setWarningDialogOpen(false);
      setPendingWarnings([]);
      if (err instanceof ServerError) {
        mapServerError(err);
      } else {
        showToast("Gagal menyimpan jurnal. Silakan coba lagi.", "error");
      }
    }
  }, [acknowledgedCodes, pendingWarnings, doTrigger, mapServerError, showToast, router]);

  const closeWarningDialog = useCallback(() => {
    if (isSubmitting) return;
    setWarningDialogOpen(false);
    setPendingWarnings([]);
    // Data intact — no reset
  }, [isSubmitting]);

  return (
    <JournalCreateContext.Provider
      value={{
        postingDate,
        memo,
        lines,
        warningDialogOpen,
        pendingWarnings,
        formError,
        fieldErrors,
        isSubmitting,
        enabled,
        setPostingDate,
        setMemo,
        setLines,
        handleSubmit,
        handleConfirmWarnings,
        closeWarningDialog,
      }}
    >
      {children}
    </JournalCreateContext.Provider>
  );
}
