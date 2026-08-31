"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { DateTime } from "luxon";
import { ServerError } from "@/core/resources/server-error";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { shouldRotateIdempotencyKey } from "@/core/helpers/idempotency-rotation";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { CashCategoryEntity } from "@/features/accounting/domain/entities/cash-category";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { useCreateCashEntry } from "@/features/accounting/presentations/hooks/use-create-cash-entry";
import { classifyCreateError } from "@/app/(authenticated)/accounting/cash-entries/new/_utils/classify-create-error";

export type CashEntryCreateFieldErrors = {
  amount?: string;
  date?: string;
  category?: string;
};

type CashEntryCreateContextValue = {
  direction: CashEntryDirection;
  amount: number;
  date: DateTime | undefined;
  category: CashCategoryEntity | null;
  note: string;
  fieldErrors: CashEntryCreateFieldErrors;
  formError: string | null;
  isSubmitting: boolean;
  isFormComplete: boolean;
  changeDirection: (direction: CashEntryDirection) => void;
  setAmount: (amount: number) => void;
  setDate: (date: DateTime | undefined) => void;
  setNote: (note: string) => void;
  selectCategory: (category: CashCategoryEntity | null) => void;
  handleSubmit: () => Promise<void>;
  createCategoryDialogOpen: boolean;
  openCreateCategoryDialog: () => void;
  closeCreateCategoryDialog: () => void;
  onCategoryCreated: (category: CashCategoryEntity) => void;
};

const CashEntryCreateContext = createContext<CashEntryCreateContextValue | null>(null);

export function useCashEntryCreate() {
  const context = useContext(CashEntryCreateContext);
  if (!context) throw new Error("useCashEntryCreate must be used within CashEntryCreateProvider");
  return context;
}

type CashEntryCreateProviderProps = {
  children: React.ReactNode;
};

export function CashEntryCreateProvider({ children }: CashEntryCreateProviderProps) {
  const router = useRouter();
  const { showToast } = useToast();
  const { trigger, isMutating } = useCreateCashEntry();

  const [direction, setDirection] = useState<CashEntryDirection>(CashEntryDirection.In);
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState<DateTime | undefined>(DateTime.now().startOf("day"));
  const [category, setCategory] = useState<CashCategoryEntity | null>(null);
  const [note, setNote] = useState("");
  const [fieldErrors, setFieldErrors] = useState<CashEntryCreateFieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [createCategoryDialogOpen, setCreateCategoryDialogOpen] = useState(false);

  // One UUID per form session — reused across retries of the same logical attempt, rotated
  // only on a definitive 4xx (shouldRotateIdempotencyKey). Never rotated on a bare catch: a
  // 5xx or network failure may already have recorded the entry server-side.
  const idempotencyKeyRef = useRef(crypto.randomUUID());

  const isSubmitting = isMutating;

  const isFormComplete = useMemo(() => amount > 0 && !!date && !!category, [amount, date, category]);

  const changeDirection = useCallback(
    (next: CashEntryDirection) => {
      if (next === direction) return;
      setDirection(next);
      // Server copy may name the previous direction's category pair — it cannot survive a
      // direction switch. Client-side field errors stay: nothing they describe has been fixed.
      setFormError(null);
      // Dependent-field reset keyed on the SELECTION becoming invalid, not on "a direction was
      // clicked" — an untouched selection is untouched, so there is nothing to discard.
      setCategory((prev) => (prev && prev.direction !== next ? null : prev));
    },
    [direction],
  );

  const handleAmountChange = useCallback((value: number) => {
    setAmount(value);
    setFieldErrors((prev) => (prev.amount ? { ...prev, amount: undefined } : prev));
  }, []);

  const handleDateChange = useCallback((value: DateTime | undefined) => {
    setDate(value);
    setFieldErrors((prev) => (prev.date ? { ...prev, date: undefined } : prev));
  }, []);

  const selectCategory = useCallback((value: CashCategoryEntity | null) => {
    setCategory(value);
    setFieldErrors((prev) => (prev.category ? { ...prev, category: undefined } : prev));
  }, []);

  const openCreateCategoryDialog = useCallback(() => setCreateCategoryDialogOpen(true), []);

  // Always safe to close — the dialog itself refuses to dismiss while its own create is in
  // flight, and the success path must be able to close it unconditionally.
  const closeCreateCategoryDialog = useCallback(() => setCreateCategoryDialogOpen(false), []);

  // The dialog only ever creates in the direction currently selected, so the created category
  // is always valid for the picker — auto-select it so the flow never loses its place.
  const onCategoryCreated = useCallback((created: CashCategoryEntity) => {
    setCategory(created);
    setFieldErrors((prev) => (prev.category ? { ...prev, category: undefined } : prev));
  }, []);

  const handleSubmit = useCallback(async () => {
    // Re-entry guard — a disabled button does not block Enter-key submission from a text input.
    if (isSubmitting) return;

    setFormError(null);
    const nextFieldErrors: CashEntryCreateFieldErrors = {};
    if (!date) nextFieldErrors.date = "Pilih tanggal entri kas.";
    if (amount <= 0) nextFieldErrors.amount = "Nominal harus lebih dari nol.";
    if (!category) nextFieldErrors.category = "Pilih kategori kas.";
    if (date === undefined || amount <= 0 || category === null) {
      setFieldErrors(nextFieldErrors);
      return;
    }
    setFieldErrors({});

    try {
      await trigger({
        direction,
        amount,
        categoryId: category.id,
        // Whole rupiah, `format: date` — a plain calendar date, never an offset datetime.
        date: date.toISODate() ?? "",
        idempotencyKey: idempotencyKeyRef.current,
        // An emptied note omits the key entirely — never `""` on the wire.
        note: note.trim() === "" ? undefined : note.trim(),
      });

      showToast("Entri kas berhasil dicatat.", "success");
      // Fire-and-forget: `revalidateSWRKey` refetches and rethrows on a failed refetch, and
      // here it must not delay or fail the navigation below.
      void revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_CASH_ENTRIES).catch(() => {});
      router.push("/accounting/cash-entries");
    } catch (err) {
      if (!(err instanceof ServerError)) {
        showToast("Gagal menyimpan entri kas. Silakan coba lagi.", "error");
        return;
      }

      // classifyCreateError owns the registry-fallback unwrap (UNKNOWN → details.code) — read
      // its `code` instead of re-deriving it here.
      const classified = classifyCreateError(err);

      const transportStatus = (err.details?.["status"] as number | undefined) ?? null;
      if (shouldRotateIdempotencyKey(transportStatus, classified.code)) {
        idempotencyKeyRef.current = crypto.randomUUID();
      }

      if (classified.placement === "field") {
        setFieldErrors((prev) => ({ ...prev, [classified.field]: classified.message }));
      } else if (classified.placement === "form") {
        setFormError(classified.message);
      } else {
        showToast(classified.message, "error");
      }
    }
  }, [amount, category, date, direction, isSubmitting, note, router, showToast, trigger]);

  return (
    <CashEntryCreateContext.Provider
      value={{
        direction,
        amount,
        date,
        category,
        note,
        fieldErrors,
        formError,
        isSubmitting,
        isFormComplete,
        changeDirection,
        setAmount: handleAmountChange,
        setDate: handleDateChange,
        setNote,
        selectCategory,
        handleSubmit,
        createCategoryDialogOpen,
        openCreateCategoryDialog,
        closeCreateCategoryDialog,
        onCategoryCreated,
      }}
    >
      {children}
    </CashEntryCreateContext.Provider>
  );
}
